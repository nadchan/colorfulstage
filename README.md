# Colorful Stage! 1.27 release yeay!
bahasa keren nya ini geschool mod
- bisa float apps
- liat notif
- buka tiktok
- screenshoot
- liat harga kripto
- dan masih banyak lgi
<p align="left">
    <img src="float.png" alt="Description" width="720">
</p>
## Introduction
Colorfulstage! is a remake of the "Geschool Secure Mode" app ([Google Play Link](https://play.google.com/store/apps/details?id=net.geschool.app.secure&hl=en)). The goal of this project is to remove all the security and freedom features from the original app.
> © ColorfulStage! is brand name by sega and colorfulpalete  (because i like game named project sekai hehe so i named colorfulstage)

## how to use 
[tutorial make](https://github.com/nadchan/colorfulstage/blob/main/howtouse.md) klik disini untuk cara memakainya (males nulis anjer).

## how to build
gitclone repo ini Salin file zip ini kedalam folder yang kamu akses, setelah itu masuk ke directory yang tadi digunakan atau yang ingin diakses, setelah itu pastikan kamu sudah memiliki alat ini :

- Node.js (Versi 20 / keatas)
- NPM / Yarn
- Termux (Jika ingin menjalankan dihp)

Buka folder project ini yang kamu taruh, lalu install dengan `npm i` atau `yarn`.

Setelah semua ada, pertama tama kamu harus memiliki file / aplikasi original dari geschool, bisa unduh officalnya [di playstore]().

Setelah itu buka tautan [seb://geschool-tryout-mod.tiiny.host/test/tryout.seb](seb://geschool-tryout-mod.tiiny.host/test/tryout.seb) yang akan langsung menuju ke aplikasi geschool, buka aplikasi originalnya, lalu tunggu hingga masuk ke aplikasi, jika sudah maka ada halaman untuk mendapatkan semua request header, ambil bagian user agent saja.

Setelah itu buka file [App.js](./App.js) dan ubah bagian variable `geschoolVersionRequest` dan ubah yang ada, setelah semuanya normal, waktunya test menggunakan Expo Go.

Jika semuanya sudah normal, coba build dengan

```bash
eas build --platform android --profile preview
```

## Disclaimer
This repository is for educational purposes only.
