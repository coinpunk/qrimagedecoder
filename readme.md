# What

This is a wrapper around the javascript qr decoder by Lazar Laszlo.
It provides better success rates when scanning QR codes from a static image.

# Why

Live camera feeds with high frame rates enable qr codes to be scanned with
ease. However static images can sometimes not be at the quality required for
scanning, for a number of reasons.

The aim was to simulate a live camera feed with a static image, thus providing
more accurate qr scanning from a single image.

The motivation was coinpunk bitcoin wallet uses jsqrcode but was often failing
to correctly decode the image, making it difficult to use as a mobile wallet.

# How

A live camera feed is simulated
by iteratively adjusting various image properties so the best settings to
decode the qr code can be found.

The algorithm does progressive enhancement on the image to be decoded using
gradual blurring of the image.

I'm sure there are better techniques using other image processing techinques.
If you know any please feel free to suggest them via an issue or pull request.

# Usage

```
new QrImageDecoder({
    src: "http://example.com/qr.png", // or a data uri
    success: function(result) {
         console.log(result);
    },
    error: function() {
        console.log("Unable to decode QR");
    }
})
```

# Dependencies

jsqrcode - https://github.com/LazarSoft/jsqrcode

# Simple example

```
$ cd /path/to/ianpunk
$ python -m SimpleHTTPServer
```

and load `http://localhost:8000`

# Simulation of coinpunk integration

```
$ cd /path/to/ianpunk
$ python -m SimpleHTTPServer
```

and load `http://localhost:8000/coinpunk.html`

# Tests and optimisation

```
$ cd /path/to/ianpunk
$ python -m SimpleHTTPServer
```

and load `http://localhost:8000/test.html`

# Data

If you have a qr image that does not scan with coinpunk, please raise an issue
with the image included and I will add it to the test suite.
