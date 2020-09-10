import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, ToastAndroid } from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner'
import * as Permission from 'expo-permissions'
import * as firebase from 'firebase'
import db from '../config'



export default class TransactionScreen extends React.Component{
    constructor(){
        super();
        this.state={
            hasCameraPermission:null,
            scanned:false,
            scannedData:'',
            buttonState:'normal',
            scannedBookId:'',
            scannedStudentId:'',
            transactionMessage:''
        }
    }
    handleTransaction=async()=>{
        var transactionMessage
        db.collection('books').doc(this.state.scannedBookId).get()
            .then((doc)=>{
                var book=doc.data()
                if (book.bookAvailability){
                    this.initiatebookIssue()
                    transactionMessage='Book issue'
                   ToastAndroid.show(transactionMessage,ToastAndroid.SHORT)
                }
                else {
                    this.initiatebookReturn()
                    transactionMessage='Book return'
                    ToastAndroid.show(transactionMessage,ToastAndroid.SHORT)
                }
            }
        )
        this.setState({
            transactionMessage:transactionMessage
        })
    }
    initiatebookIssue=async()=>{
        db.collection('transactions').add({
            'studentId':this.state.scannedStudentId,
            'bookId':this.state.scannedBookId,
            'date':firebase.firestore.Timestamp.now().toDate(),
            'transactionType':'issue'
        })
        db.collection('books').doc(this.state.scannedBookId).update({
           'bookAvailability':false
        })
        db.collection('student').doc(this.state.scannedStudentId).update({
            'numberOfBooksIssued':firebase.firestore.FieldValue.increment(1)
         })
         Alert.alert('bookIssue')
         this.setState({
             scannedBookId:'',
             scannedStudentId:''
         })
    }
    initiatebookReturn=async()=>{
        db.collection('transactions').add({
            'studentId':this.state.scannedStudentId,
            'bookId':this.state.scannedBookId,
            'date':firebase.firestore.Timestamp.now().toDate(),
            'transactionType':'return'
        })
        db.collection('books').doc(this.state.scannedBookId).update({
           'bookAvailability':true
        })
        db.collection('student').doc(this.state.scannedStudentId).update({
            'numberOfBooksIssued':firebase.firestore.FieldValue.increment(-1)
         })
         Alert.alert('bookIsReturned')
         this.setState({
             scannedBookId:'',
             scannedStudentId:''
         })
    }
    getCameraPermission = async (id) =>{
const {status}=await Permissions.askAsync(Permissions.CAMERA);
this.setState({
    hasCameraPermission:status==='granted',
    scanned:false,
    buttonState:id
})
    }
    handleBarCodeScanned=async({type,data})=>{
        this.setState({scanned:true,scannedData:data, buttonState:'normal'})
    }
    render(){
        const hasCameraPermission=this.state.hasCameraPermission;
        const scanned=this.state.scanned;
        const buttonState=this.state.buttonState;
        if(buttonState==='clicked' && hasCameraPermission){
            return(
                <BarCodeScanner
                onBarCodeScanned={scanned ? undefined:this.handleBarCodeScanned}
style={StyleSheet.absoluteFillObject}
                ></BarCodeScanner>
            )
        }
        else if(buttonState ==='normal'){
    return(
<KeyboardAvoidingView>
        <View> 
            <View>
            
                <Image
                source ={require ('../assets/booklogo.jpg')}
                style={{width:200,height:200}}
                />
                <Text
                style={{textAlign:'center',fontSize:30}}
                >Wily</Text>
            </View>
            <Text> {
                hasCameraPermission===true ? this.state.scannedData:'request camera permission'
                } </Text>
                <View>
<TextInput
placeholder='Book Id'
onChangeText={text=>{
    this.setState({
        scannedBookId:text
    })
}}
value={this.state.scannedBookId}
></TextInput>
               
    <TouchableOpacity
    onPress={()=>{this.getCameraPermission('BookId')}}
    >

        <Text>Scan</Text>
    </TouchableOpacity>
        </View>
        <View>
<TextInput
placeholder='Student Id'
onChangeText={text=>{
    this.setState({
        scannedStudentId:text
    })
}}
value={this.state.scannedStudentId}
></TextInput>
               
    <TouchableOpacity
    onPress={()=>{this.getCameraPermission('StudentId')}}

    >

        <Text>Scan</Text>
    </TouchableOpacity>
        </View> 
        <TouchableOpacity
         onPress={async()=>{var transactionMessage=this.handleTransaction();
         this.setState({
scannedBookId:'',
scannedStudentId:''
         })
        }}
        >
            <Text>Submit</Text>
            </TouchableOpacity>

        </View>
        </KeyboardAvoidingView>
    )}
}}