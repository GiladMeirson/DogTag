ProfileData=null;
const prefixPhoto=`https://proj.ruppin.ac.il/cgroup41/test2/tar1/uploadedFiles/`;
$(document).ready(function() {
    ProfileData = JSON.parse(localStorage.getItem('profileData'));
    var modal = document.getElementById('modal');
    var closeBtn = document.getElementsByClassName('close')[0];
    var notifyBtnModal = document.getElementById('notifyOwnerModal');
    var notifyBtnPage = document.getElementById('notifyOwnerPage');
    if (ProfileData!=null) {
        RenderDetails();
    }

   
    modal.style.display = 'block';

    
    closeBtn.onclick = function() {
        modal.style.display = 'none';
    }

    
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }






    // פונקציה לטיפול בלחיצה על כפתור "הודע לבעלים"
    function handleNotifyClick() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var lat = position.coords.latitude;
                var lon = position.coords.longitude;
                // כאן תצטרך להוסיף את הפרטים של הבעלים והחיה
                var ownerEmail = ProfileData.ownerEmail; // יש להחליף בכתובת האמיתית
                var ownerName = ProfileData.ownerName;
                var petName = ProfileData.petName;
                //console.log(lat, lon, ownerEmail, ownerName, petName);
                //reverseGeocodeAndSendEmail(lat, lon, ownerEmail, ownerName, petName);
                getPreciseAddress(lat, lon).then(preciseAddress => {
                    //console.log(preciseAddress);
                    let googleMapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
                    //console.log(googleMapsUrl);
                    let subject = `מצאו את ${petName}! 🐾`;
                    let h1 = `<h1 style="text-align:center;">שלום ${ownerName}, ${petName} אבד,</h1> <br>`;
                    let h2=`<h2 style="text-align:center;">אך אל דאגה מצאו אותו! 🎉</h2> <br>`;
                    let h3=`<h2 style="text-align:center;">והברקוד שלו נסרק ב-</h2>`;
                    let h4=`<h2 style="text-align:center;">כתובת מדויקת: ${preciseAddress}</h2> <br>`;
                    let h5=`<h2 style="text-align:center;">קישור לכתובת המדויקת שבה נסרק הברקוד במפות גוגל: ${googleMapsUrl}</h2> <br>`;
                    let embad = `<iframe src="${preciseAddress}"></iframe>`
                    let body = h1+h2+h3+h4+h5+embad;
                    sendEmail(ownerEmail, subject, body);
                    

                });
            }, function(error) {
                alert("לא הצלחנו לאתר את מיקומך: " + error.message);
            });
        } else {
            alert("הדפדפן שלך אינו תומך באיתור מיקום.");
        }
    }
    // הוסף אירועי לחיצה לשני הכפתורים
    notifyBtnModal.addEventListener('click', function() {
        handleNotifyClick();
        modal.style.display = 'none';
    });

    notifyBtnPage.addEventListener('click', handleNotifyClick);
});


const RenderDetails=()=>{
    $('#findH2Modal').html(`מצאת את ${ProfileData.petName} !`);
    let profilephoto =ProfileData.profileLink.split(`\\`)[ProfileData.profileLink.split(`\\`).length-1];
    let coverphoto =ProfileData.coverLink.split(`\\`)[ProfileData.coverLink.split(`\\`).length-1];
    $('#cover-image').css('background-image', `url(${prefixPhoto+coverphoto})`);
    $('#profile-image').css('background-image', `url(${prefixPhoto+profilephoto})`);

    $('#petNameTitle').html('שם: '+ProfileData.petName);
    $('#pettypelabel').html('סוג: '+ProfileData.petType);
    ProfileData.petGender=='female'?$('#petAgelabel').html('בת: '+ProfileData.petAge+' שנים'):$('#petAgelabel').html('בן: '+ProfileData.petAge+' שנים');
    $('#kalevet').html(`חיסון כלבת : ${ProfileData.vaccineRabies?'✅':'❌'}`);
    $('#meshushe').html(`חיסון משושה : ${ProfileData.vaccineDistemper?'✅':'❌'}`);
    $('#park').html(`חיסון לתולעת הפארק : ${ProfileData.dewormed?'✅':'❌'}`);
    $('#sirus').html(` סירוס : ${ProfileData.neutered?'✅':'❌'}`);

    $('#ownerName').html('שם : '+ProfileData.ownerName);
    $('#ownerMail').html(ProfileData.ownerEmail);
    $('#ownerPhone').html(ProfileData.ownerPhone);
    let phone = ProfileData.ownerPhone.slice(1);
    phone = `+972${phone}`;

    $('#ownerPhone').attr('href', `tel:${phone}`);
    $('#ownerMail').attr('href', `mailto:${ProfileData.ownerEmail}`);





}



function sendEmail(to,subject,body) {
    
    Email.send({
        SecureToken:'9512cd3e-b42e-4791-8bb0-7294b2bc2dfb',
  
        To: to,
        From: "gilad.meirson@gmail.com",
        Subject: subject,
        Body:body,
    }).then(
        message =>
        swal.fire({
            title: 'הודעה נשלחה!',
            text: 'הודעה נשלחה בהצלחה לבעלים.',
            icon: 'success',
            confirmButtonText: 'אישור'
        })
        

    );
}







async function getPreciseAddress(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const address = data.address;

        let addressParts = [];
        if (address.road) addressParts.push(address.road);
        if (address.house_number) addressParts.push(address.house_number);
        if (address.neighbourhood) addressParts.push(address.neighbourhood);
        if (address.suburb) addressParts.push(address.suburb);
        if (address.city || address.town || address.village) {
            addressParts.push(address.city || address.town || address.village);
        }
        if (address.state) addressParts.push(address.state);
        if (address.country) addressParts.push(address.country);

        // מחברים את כל חלקי הכתובת לכתובת אחת מלאה
        const preciseAddress = addressParts.join(', ');

        return preciseAddress;
    } catch (error) {
        console.error('שגיאה בקבלת הכתובת:', error);
        return `לא הצלחנו לקבל כתובת מדויקת. קווי רוחב: ${lat}, קווי אורך: ${lon}`;
    }
}

// דוגמה לשימוש:
// getPreciseAddress(32.0853, 34.7818).then(address => console.log(address));