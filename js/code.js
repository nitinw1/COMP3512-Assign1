document.querySelector(".singlePaintingView").style.display = "none";
document.querySelector("#closeB").onclick = function () { document.querySelector(".singlePaintingView").style.display = "none";
                                                         document.querySelector(".defaultView").style.display = "grid";
                                                        };
//parsing the data from local storage
const gallaryData = JSON.parse(window.localStorage.getItem('allGallery'));
//creating a array
let galleries = [];

//url for the data
let gallaryAPI = 'https://www.randyconnolly.com/funwebdev/3rd/api/art/galleries.php';

//let loader = `<div class="loader"></div>`;
//document.querySelector('.mainContainer').innerHTML = loader;

//fetch the data 
fetch(gallaryAPI)
    .then(function(response){
    return response.json();
})
    .then(function(data){
    localStorage.setItem('allGallery', JSON.stringify(data));
    //document.querySelector('.loader').style.display = "none";
    //document.querySelector('.mainContainer').style.display = "grid";
    printAllGallery(gallaryData);
}) 
    .catch(function(error){
    console.log(error);
});


//Adding loading GIF
const imgGIF = document.createElement("img");
imgGIF.setAttribute("class", "loadingImg");
imgGIF.setAttribute("src", "loadingGIF.gif");
imgGIF.setAttribute("alt", "Loading");
document.querySelector("#glist").appendChild(imgGIF);

//Display All Galleries 
function printAllGallery(data){

    console.log(data);
    //document.querySelector('.mainContainer').innerHTML = "";
    for(let p of data){
        //get the ul element
        let gallery = document.querySelector('.listGallaries');

        //create a list element
        let list = document.createElement('li');

        list.setAttribute('id', p.GalleryID);
        list.textContent = p.GalleryName;
        gallery.appendChild(list);  
    }
    document.querySelector('.loadingImg').style.display = "none";
}

//Adding loading GIF
const imgGIF2 = document.createElement("img");
imgGIF2.setAttribute("class", "loadingImg2");
imgGIF2.setAttribute("src", "loadingGIF.gif");
imgGIF2.setAttribute("alt", "Loading");
document.querySelector("#galleryLoad").appendChild(imgGIF2);


//Display clicked Gallery info
function printClickedGallery(event) {
    document.querySelector('.loadingImg2').style.display = "none";
    let gallery = document.querySelector('#galleryInfo');
    for (let i = 0; i < gallaryData.length; i++) {
        if (gallaryData[i].GalleryID == event) {

            let listItem = document.querySelector('#gName');
            listItem.textContent = gallaryData[i].GalleryName;

            listItem = document.querySelector('#nativeName');
            listItem.textContent = gallaryData[i].GalleryNativeName;

            listItem = document.querySelector('#gCity');
            listItem.textContent = gallaryData[i].GalleryCity;

            listItem = document.querySelector('#gAddress');
            listItem.textContent = gallaryData[i].GalleryAddress;

            listItem = document.querySelector('#gCountry');
            listItem.textContent = gallaryData[i].GalleryCountry;

            listItem = document.querySelector('#gWebsite');
            listItem.textContent = gallaryData[i].GalleryWebSite;
            listItem.setAttribute("href", gallaryData[i].GalleryWebSite);


        }
    }

}

let map;
function displayMap(data) {
    for (let i = 0; i < gallaryData.length; i++) {
        if (gallaryData[i].GalleryID == data) {
            //Reterive the latitude, longitude and the city from the gallery clicked. 
            let latitude = gallaryData[i].Latitude;
            let longitude = gallaryData[i].Longitude;
            let city = gallaryData[i].GalleryCity;
            map = new google.maps.Map(document.querySelector('.map'), {
                center: {
                    lat: latitude,
                    lng: longitude
                },
                mapTypeId: 'satellite',
                zoom: 18
            });
        }
    }
}

function mktdCell (rowID) {
    let mktd = document.createElement("td"); 
    let tableRow = document.querySelector("#paintingsTable #pRow" + rowID);
    mktd = document.createElement("td");
    tableRow.appendChild(mktd);
}

function mktdCell (rowID, text) {
    let mktd = document.createElement("td"); 
    let tableRow = document.querySelector("#paintingsTable #pRow" + rowID);
    mktd = document.createElement("td");
    mktd.textContent = text;
    tableRow.appendChild(mktd);
}

function displayPaintings(pData) {

    let mktr = document.createElement("tr");
    let mktd = document.createElement("td");
    let mkimg = document.createElement("img");
    let mkp = document.createElement("p");
    let rowID = 1;
    let newtbody = document.createElement("tbody");
    let oldBody = document.querySelector("#paintingsTable");
    oldBody.parentNode.replaceChild(newtbody, oldBody);

    newtbody.setAttribute("id", "paintingsTable");
    for (p of pData) {

        //Create Row
        let tableBody = document.querySelector("#paintingsTable");
        mktr = document.createElement("tr");
        mktr.setAttribute("id", "pRow" + rowID);
        tableBody.appendChild(mktr);

        mktdCell(rowID);

        //Create row Image
        let tableData = document.querySelector("#pRow" + rowID + " td");
        mkimg = document.createElement("img");
        let imgSize = p.Width;
        let imgFileName = p.ImageFileName;
        mkimg.setAttribute("src", "https://res.cloudinary.com/funwebdev/image/upload/w_80/art/paintings/" + imgFileName);
        mkimg.setAttribute("title", p.PaintingID);
        tableData.appendChild(mkimg);
        //Create Artist Name
        mktdCell(rowID, isNull(p.FirstName) + " " + p.LastName);

        //Create Painting title
        mktdCell(rowID, p.Title);

        //Create Painting year
        mktdCell(rowID, p.YearOfWork);

        rowID++;
    }
}

let displayValue = "true";
//toogle button
let getButton = document.querySelector(".toogleButton");
getButton.style.backgroundColor="lime";
getButton.addEventListener("click", function(){
    if(displayValue == "true"){
        document.querySelector(".galleryList").style.display="none";
        displayValue = "false";
        getButton.style.backgroundColor="red";
    }
    else {
        document.querySelector(".galleryList").style.display="block";
        displayValue = "true";
        getButton.style.backgroundColor="lime";
    }



});

const gList = document.querySelector('#glist');
gList.addEventListener("click", function (event) {
    let itemID = event.target.getAttribute("id");
    let itemAPI = 'https://www.randyconnolly.com/funwebdev/3rd/api/art/paintings.php?gallery=' + itemID; 

    fetch(itemAPI)
        .then(function(response){
        return response.json();
    })
        .then(function(data){
        localStorage.setItem('allPaintings', JSON.stringify(data));
        let paintingData = JSON.parse(window.localStorage.getItem('allPaintings'));
        console.log(paintingData);
        printClickedGallery(itemID);
        displayMap(itemID);
        displayPaintings(paintingData);
        paintingListListener(paintingData);
    }) 
        .catch(function(error){
        console.log(error);
    });
}); 


function paintingListListener(pData) {
    paintingList = document.querySelectorAll("#paintingsTable img");
    for (p of paintingList) {
        p.addEventListener("click", function (event) {
            let painting = event.target;
            document.querySelector(".defaultView").style.display = "none";
            document.querySelector(".singlePaintingView").style.display = "block";
            displaySinglePainting(pData, painting);

        });
    }
}


function displaySinglePainting (pData, imgElement) {
    let newUl = document.createElement("ul");
    let oldUl = document.querySelector("#singlePUl ul");
    oldUl.parentNode.replaceChild(newUl, oldUl);
    let singlePImg = document.querySelector("#singlePaintingTable img");
    let singlePList = document.querySelector("#singlePaintingTable ul");

    //let modalImg = document.querySelector("#myModal");

    for (p of pData) {
        if (imgElement.getAttribute("title") == p.PaintingID) {

            singlePImg.setAttribute("src", "https://res.cloudinary.com/funwebdev/image/upload/w_250/art/paintings/" + p.ImageFileName);
            singlePImg.setAttribute("class", "paintImage");

            let pTitle = mkListItem(p.Title + ", " + p.YearOfWork + ", " + p.CopyrightText + ", "+ p.Medium + ", " + p.Height + "x" + p.Width);
            let aName = mkListItem(isNull(p.FirstName) + " " + p.LastName);
            let pInfo = mkListItem(p.GalleryName + ", " + p.GalleryCity);
            let pDesc = mkListItem(p.Description);
            let mLink = document.createElement("a");
            mLink.setAttribute("href", p.MuseumLink);
            mLink.textContent = p.GalleryName + "'s Website";

            singlePList.appendChild(pTitle);
            singlePList.appendChild(aName);
            singlePList.appendChild(pInfo);
            singlePList.appendChild(mLink);
            singlePList.appendChild(pDesc);
            expandPainting(p.Title);
        }

    }
}

function mkListItem (text) {
    let item = document.createElement("li");
    item.textContent = text;
    return item;
}
function isNull (fn) {
    if (fn) {
        return fn;
    }
    return "";
}

//process header click on painting list
//const paintingH2 = document.querySelectorAll("div>h4");
//addHeaderClickListeners(paintingH2);

//function processPaintingsInfo(id, sortBase) {
    //display loading gif while data is retrieved
  //  document.querySelector("#title").innerHTML = "";
  //  document.querySelector("#title").appendChild(imgGif);
   // const paintingInfoURL = getPaintingInfoURL(id);
   // console.log("************* ---> " + sortBase);
   // reInitializePaintingList();
    //fetch and sort data
   // fetch(paintingInfoURL).then(response => response.json()).then(data => {
        //sortData(sortBase, data);
        //remove loading gif, by re-adding Title header
        //document.querySelector("#title th").textContent = "Title";
        //add painting items
        //addPaintingList(data);

    //}).catch(error => {
      //  console.error(error)
//    });
//}


// Modal code from W3schools 
// https://www.w3schools.com/howto/howto_css_modals.asp
// Get the modal
function expandPainting () {
    let modal = document.getElementById("myModal");

    // Get the image and insert it inside the modal
    let img = document.getElementById("bigPainting");
    let modalImg = document.getElementById("img01");
    modalImg.setAttribute("src", img.getAttribute("src"));
    img.onclick = function(){
        modal.style.display = "block";
    }


    // Get the button that opens the modal
    let btn = document.getElementById("bigPainting");

    // Get the <span> element that closes the modal
    let span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function() {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

}
