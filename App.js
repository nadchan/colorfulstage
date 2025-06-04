import { Dimensions, StatusBar as StatusBarReact, ToastAndroid, BackHandler, View, Image, ActivityIndicator, Alert, Text } from "react-native"
import { StatusBar } from "expo-status-bar"
import { useState, useEffect } from "react"
import { SafeAreaView, useSafeAreaInsets, SafeAreaProvider } from "react-native-safe-area-context"
import WebView from "react-native-webview"
import * as Linking from 'expo-linking'
import * as Device from 'expo-device'
import axios from "axios"
import seb_parser from "./lib/seb-parser"

const { height, width } = Dimensions.get("window")
const geschoolVersionRequest = "1.27" // change ur geschool version here 

const userAgent = {
  dalvik: `Dalvik/2.1.0 (Linux; U; Android ${Device.osVersion}; ${Device.modelName} Build/${Device.osInternalBuildId})`,
  webview: `Mozilla/5.0 (Linux; Android ${Device.osVersion}; ${Device.modelName} Build/${Device.osInternalBuildId}; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/119.0.6943.137 Mobile Safari/537.36 SEB/1.0 Geschool/${geschoolVersionRequest}`
}

function WarpAppRun() {
  const insets = useSafeAreaInsets()
  const [savePayload, setPayload] = useState(null)
  const [sebUrl, setSebUrl] = useState("https://tryout.geschool.net/publics/secure2.html")
  const [saveLogout, setLogout] = useState(null)
  const [focus, setFocus] = useState(false)
  const [confirmExit, setConfirmExit] = useState(false)

  const url = Linking.useURL()
  console.log("URL Deep:", url)

  async function LoadingTryout(host) {
    console.log("Running Tryout:", host)
    if(host.startsWith("exp://") && !host.split("--/")[0]) {
      console.log("Skin Run...")
      return
    }
    try {
      const { data } = await axios.get(host, {
        headers: {
          accept: "*/*",
          'user-agent': userAgent.dalvik,
          'accept-encoding': 'gzip'
        }
      })
      const parsingData = seb_parser(data)
      setSebUrl(parsingData.json.startURL)
      setLogout(parsingData.json.quitURL)
      setTimeout(() => {
        setFocus(true)
      }, 200)
      StatusBarReact.setHidden(true)
    } catch(e) {
      ToastAndroid.show("Error Loading Tryout", ToastAndroid.SHORT)
      console.log("Error Request:",e.stack)
    }
  }

  useEffect(() => {
    const backAction = () => {
      if(!saveLogout) {
        return false;
      }
      if(!confirmExit) {
        ToastAndroid.show("Tekan Back sekali lagi untuk keluar", ToastAndroid.SHORT)
        setConfirmExit(true)
        setTimeout(() => {
          // berhenti memberikan back action
          setConfirmExit(false)
        },3000)
        return true;
      }
    }

    const goBackHandler = BackHandler.addEventListener("hardwareBackPress", backAction)
    return () => goBackHandler.remove()
  }, [saveLogout, confirmExit])

  useEffect(() => {
    if(url && !saveLogout) {
      let urlToRequest = null
      if(url.startsWith("exp://") && !!url.split("--/")[1]) {
        setPayload(url)
        const hostRequest = String("https://"+url.split("--/")[1])
        console.log("Request Developer... URL:", hostRequest)
        urlToRequest = hostRequest
      } else {
        setPayload(url)
        const hostRequest = url.replace("seb://", "https://").replace("sebs://", "https://")
        console.log("Request Developer... URL:", hostRequest)
        urlToRequest = hostRequest
      }
      if(urlToRequest) {
        LoadingTryout(urlToRequest)
      }
    }
  }, [url, savePayload])

  useEffect(() => {
    StatusBarReact.setHidden(false)
    return () => {
      StatusBarReact.setHidden(false)
    }
  }, [])

  console.log("Seb:", sebUrl)

  return <View style={{
      paddingTop: insets.top,
      paddingLeft: insets.left,
      paddingRight: insets.right,
      paddingBottom: insets.bottom,
      backgroundColor: focus? "#000000":"#1668a8"
    }}>
    <View
      style={{
        flex: 1,
        backgroundColor: focus? "#000000":"#1668a8"
      }}>
      <StatusBar style="auto" />
      <View style={{width: width, height: height, backgroundColor: "#ffffff"}}>
      {sebUrl && (
        <WebView
          domStorageEnabled={true}
          onShouldStartLoadWithRequest={(request) => {
            console.log(request)
            const { headers } = request
            if(!headers) {
              return true
            }
            if(!headers['x-requested-with']) {
              headers['x-requested-with'] = "net.geschool.app.secure"
            }
            headers['makan-nasi'] = "1"
            headers['x-requested-with'] = "net.geschool.app.secure"
            return true
          }}
          onOpenWindow={(e) => {
            if(e.nativeEvent.targetUrl === saveLogout) {
              BackHandler.exitApp()
              ToastAndroid.show("App unpin", ToastAndroid.SHORT)
            }
          }} // Disable open browser
          source={{
            uri: sebUrl,
            headers: {
              'user-agent': userAgent.webview,
              'accept-encoding': 'gzip, deflate, br, zstd',
              'sec-ch-ua-platform': '"Android"',
              "x-requested-with": "net.geschool.app.secure",
              'makan-nasi': "-2"
            }
          }}
          onNavigationStateChange={(e) => {
            if(e.url === saveLogout) {
              BackHandler.exitApp()
              ToastAndroid.show("App unpin", ToastAndroid.SHORT)
            }
          }}
          style={{ flex: 1 }}
        />
      )}
      </View>
    </View>
  </View>
}

export default function AppRun() {
  return <SafeAreaProvider>
    <WarpAppRun />
  </SafeAreaProvider>
}
