module.exports = {
    pinFileToIPFS: function(credit){
        return pinFileToIPFS(credit);
    }
}

const pinFileToIPFS = async (credit) => {
    const FormData = require("form-data");
    const axios = require("axios");
    const fs = require("fs");
    const { createCanvas, loadImage } = require("canvas");
    const JWT = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJlZjhkMmU1YS05ZTRkLTRkYzEtYTliNC0xZjg5YzJlZTczZTgiLCJlbWFpbCI6ImFkdmFpdGhuYXJheWFuYW44QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImlkIjoiRlJBMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfSx7ImlkIjoiTllDMSIsImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxfV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiI3OTE4ODQyYWJlOWVmYWQ4ZGQ5NiIsInNjb3BlZEtleVNlY3JldCI6IjQ3ODllNjg3ZTc4OGZjN2Q2NzViNzAyZjIxOTJjMzYzNWEwMTVkMDU2ZWY4YzBiZWY4MzdiZjk1ZjEzN2M4NTkiLCJpYXQiOjE2Njk5NzIxNzZ9.zmATe2BUDoIpe7SWZshRRXp5EnTRDPAP0N6P66vWdXc`;
    const canvas = createCanvas(506, 304);
    const context = canvas.getContext("2d");
    const image = await loadImage("template.png");
    var text = credit;
    context.drawImage(image, 0, 0, 506, 304);
    context.fillStyle = "#fff";
    context.font = "bold 60pt Menlo";
    context.fillText(text, 305, 160);
    var currentdate = new Date();
    text =
        currentdate.getDate() +
        "/" +
        (currentdate.getMonth() + 1) +
        "/" +
        currentdate.getFullYear();
    context.fillStyle = "#fff";
    context.font = "medium 15pt Menlo";
    context.fillText(text, 100, 240);
    const buffer = canvas.toBuffer("image/png");
    fs.writeFileSync("./output.png", buffer);

    const formData = new FormData();
    const src = "./output.png";

    const file = fs.createReadStream(src);
    formData.append("file", file);

    const metadata = JSON.stringify({
        name: "File name",
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
        cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    try {
        const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
            maxBodyLength: "Infinity",
            headers: {
            "Content-Type": `multipart/form-data; boundary=${formData._boundary}`,
            Authorization: JWT,
            },
        }
        );
        return(res.data.IpfsHash);
    } catch (error) {
        console.log(
        "======================================================================="
        );
        console.log(error);
    }
};
