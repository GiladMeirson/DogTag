const photosAPI = `https://proj.ruppin.ac.il/cgroup41/test2/tar1/api/Upload/uploadImages`;
const profileInsertAPI = `https://proj.ruppin.ac.il/cgroup41/test2/tar1/api/Profiles/InsertProfile`;
const GetProfileAPI = `https://proj.ruppin.ac.il/cgroup41/test2/tar1/api/Profiles/GetProfileById?url=`;



$(document).ready(()=>{
    $('.loader-overlay').hide();
    //console.log("Hello World");
    let urllocs = window.location.href.split('/');
    urllocs = urllocs[urllocs.length-1].split('.')[0];
    fetchIfThisUrlGotData(urllocs);
    //console.log(urllocs);
    $('#mainForm').submit((e)=>{
        $('.loader-overlay').show();
        e.preventDefault();
        //console.log("Form Submitted");
        const oWnerName = $('#owner-name').val();
        const oWnerEmail = $('#owner-email').val();
        const oWnerPhone = $('#owner-phone').val();
        const pass = $('#passwordIN').val();

        const petType = $('#pet-type').val();
        const petName = $('#pet-name').val();
        const petAge = $('#pet-age').val();
        const petGender = $('#pet-gender').val();

        //kalevet
        const vaccineRabies = $('#vaccine-rabies').is(':checked');
        //meshushe
        const vaccineDistemper = $('#vaccine-distemper').is(':checked');
        //tolat hapark
        const dewormed = $('#dewormed').is(':checked');
        //mesuras
        const neutered = $('#neutered').is(':checked');


        const petProfilePic = $('#pet-profile-pic')[0].files[0];
        const petCoverPic = $('#pet-cover-pic')[0].files[0];
    
        const formData = new FormData();
        formData.append('files', petProfilePic);
        formData.append('files', petCoverPic);
        formData.append('profilePicName', 'profile'+urllocs);
        formData.append('coverPicName', 'cover'+urllocs);

        const client = {
            id: 0,
            urlId: urllocs,
            ownerName:oWnerName,
            ownerEmail:oWnerEmail,
            ownerPhone:oWnerPhone,
            petType:petType,
            petName:petName,
            petAge:petAge,
            petGender:petGender,
            vaccineRabies:vaccineRabies,
            vaccineDistemper:vaccineDistemper,
            dewormed:dewormed,
            neutered:neutered,
            password:pass,
        }
        //console.log(client);
        //console.log(formData);
        // for (let [key, value] of formData.entries()) {
        //     console.log(key, value);
        // }

        // "id": 0,
        // "urlId": "string",
        // "ownerName": "string",
        // "ownerEmail": "string",
        // "ownerPhone": "string",
        // "petType": "string",
        // "petName": "string",
        // "petAge": 0,
        // "petGender": "string",
        // "vaccineRabies": true,
        // "vaccineDistemper": true,
        // "dewormed": true,
        // "neutered": true,
        // "profileLink": "string",
        // "coverLink": "string"





        $.ajax({
            url: photosAPI,
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: (data)=>{
                console.log(data);
                client.profileLink = data[0];
                client.coverLink = data[1];
                //console.log(client);
                $.ajax({
                    url: profileInsertAPI,
                    type: 'POST',
                    data: JSON.stringify(client),
                    contentType: 'application/json',
                    success: (data)=>{
                        console.log(data);
                        $('.loader-overlay').hide();
                        Swal.fire({
                            title: "יש! הצלחנו להעלות את הפרטים שלכם",
                            text: "הפרטים שלכם נשמרו בהצלחה, מיד תועברו לדף הפרופיל שלכם",
                            icon: "success",
                            confirmButtonText: "OK",
                        }).then(()=>{
                            sessionStorage.setItem('profileData', JSON.stringify(client));
                            window.location.href = "show.html";
                        });
                    },
                    error: (err)=>{
                        console.error(err);
                        Swal.fire({
                            title: "אופס..",
                            text: "התרחשה תקלה בעת העלאת נתונים, אנא נסו שוב.",
                            icon: "error",
                            confirmButtonText: "OK",
                        });
                    }
                });

            },
            error: (err)=>{
                console.error(err);
                Swal.fire({
                    title: "אופס..",
                    text: "התרחשה תקלה בעת העלאת נתונים, אנא נסו שוב.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        });
    });
})




const fetchIfThisUrlGotData=(url)=>{
    // here will be ajax call to get data of profile from server.
    $.ajax({
        url: GetProfileAPI+url,
        type: 'GET',
        success: (data)=>{
            console.log(data);
            if (data.id!=-1) {
                sessionStorage.setItem('profileData', JSON.stringify(data));
                location.href = "show.html";
            }
        },
        error: (err)=>{
            console.error(err);
        },
    });
}