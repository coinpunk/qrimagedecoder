// Loads all the images, tries to qr decode them, displays the results

(function() {

var imgRoot = "SampleQRs";

var imgSrcs = [
    "1.jpg",
    "2.jpg",
    "3.jpg",
    "4.jpg",
    "5.jpg",
    "6.jpg",
    "7.jpg",
    "8.jpg",
    "9.jpg",
    "perfect.png",
];

function init() {
    // Build the image source list
    var imgs = [];
    for (var i=0; i<imgSrcs.length; i++) {
        var imgSrc = imgRoot + "/" + imgSrcs[i];
        imgs.push(imgSrc);
    }
    // Create and run the test suite
    new TestSuite({
        imgs: imgs
    });
};

function TestSuite(suiteParams) {
    var imageIndex = 0;
    var totalImgs = suiteParams.imgs.length;
    var results = [];
    var totalFailed = 0;
    var table = new TestTable();
    var This = this;


    this.next = function() {
        if (imageIndex < totalImgs) {
            var testParams = getTestParams();
            new Test(testParams);
        }
        else {
            displayFinalResult();
        }
        imageIndex = imageIndex + 1;
    }

    this.tallyPass = function(testResult) {
        testComplete(testResult);
    }

    this.tallyFail = function(testResult) {
        totalFailed = totalFailed + 1;
        testComplete(testResult);
    }

    function start() {
        imageIndex = 0;
        This.next();
    }

    function getTestParams() {
        var imgSrc = suiteParams.imgs[imageIndex];
        return {
            suite: This,
            src: imgSrc,
        }
    }

    function testComplete(testResult) {
        results.push(testResult);
        table.addRow(testResult);
        This.next();
    }

    function displayFinalResult() {
        // TODO work out averages etc from the results set
        var row = document.createElement("tr");
        var cell = document.createElement("td");
        cell.colSpan = table.el.firstChild.childNodes.length;
        cell.textContent = "Failed " + totalFailed + " / " + totalImgs;
        row.appendChild(cell);
        table.el.appendChild(row);
    }

    start();
}

function TestTable() {

    var table = document.createElement("table");
    this.el = table;

    function init() {
        var heading = document.createElement("tr");
        var headings = ["Passed", "Image Source", "Decode Time (ms)", "Stats", "Result", "Before", "After"];
        for (var i=0; i<headings.length; i++) {
            var cell = document.createElement("th");
            cell.textContent = headings[i];
            heading.appendChild(cell);
        }
        table.appendChild(heading);
        document.body.appendChild(table);
    }

    this.addRow = function(rowData) {
        var row = document.createElement("tr");

        var passed = rowData.passed ? "PASS" : "FAIL";
        addCell(passed);

        addCell(rowData.src);

        addCell(rowData.totalTime);

        // TODO pretty-print
        addCell(JSON.stringify(rowData.qrImage.debug));

        addCell(rowData.qrResult);

        addImageCell(rowData.src);

        var resultUri = rowData.qrImage.canvas.toDataURL()
        addImageCell(resultUri);

        table.appendChild(row);

        function addCell(data) {
            var cell = document.createElement("td");
            cell.textContent = data;
            row.appendChild(cell);
        }

        function addImageCell(src) {
            var cell = document.createElement("td");
            var img = document.createElement("img");
            img.src = src;
            img.className = "thumbnail";
            cell.appendChild(img);
            row.appendChild(cell);

            var largeVersion = document.createElement("div");
            largeVersion.className = "large-image-container";
            largeImg = document.createElement("img");
            largeImg.src = src;
            largeVersion.appendChild(largeImg);
            document.body.appendChild(largeVersion);

            function showLargeVersion() {
                largeVersion.style.display = "block";
            }

            function hideLargeVersion() {
                largeVersion.style.display = "none";
            }

            img.addEventListener("click", showLargeVersion, false);
            largeVersion.addEventListener("click", hideLargeVersion, false);
        }
    }

    init();
}

function Test(testParams) {

    var This = this;
    var start = new Date().getTime();
    var end = null;
    var qrImage = null;

    function init() {
        qrImage = new QrImageDecoder({
            src: testParams.src,
            success: success,
            error: error
        });
    }

    function success(result) {
        // Funny that we never test against an expected value, just that it
        // get something (anythiiing) - we're not testing decode accurracy,
        // and it's fair to say if it does decode it's correct. There are
        // checksums etc so qr decoding is considered boolean.
        testParams.passed = true;
        testParams.qrResult = result;
        onComplete();
        testParams.suite.tallyPass(testParams, result);
    }

    function error() {
        testParams.passed = false;
        testParams.qrResult = "";
        onComplete();
        testParams.suite.tallyFail(testParams);
    }

    function onComplete() {
        end = new Date().getTime();
        testParams.totalTime = end - start;
        testParams.qrImage = qrImage;
    }

    init();

}


init();

})();
