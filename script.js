const form = document.getElementById('birth-certificate-form');
const generateCertificateButton = document.getElementById('generate-certificate');
const certificateContainer = document.getElementById('certificate-container');
const downloadContainer = document.getElementById('download-container');

generateCertificateButton.addEventListener('click', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const certificateData = {
        name: formData.get('name'),
        date: formData.get('date'),
        birthAddress: formData.get('birth-address'),
        fatherName: formData.get('father-name'),
        motherName: formData.get('mother-name'),
        grandfatherName: formData.get('grandfather-name'),
    };

    // Check if all required fields are filled in
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    requiredFields.forEach((field) => {
        if (!field.checkValidity()) {
            isValid = false;
        }
    });

    if (!isValid) {
        // Create a popup alert message
        const alertContainer = document.createElement('div');
        alertContainer.className = 'alert-container';
        const alertMessage = document.createElement('p');
        alertMessage.textContent = 'Please fill in all required fields!';
        alertMessage.className = 'alert-message';
        alertContainer.appendChild(alertMessage);
        document.body.appendChild(alertContainer);

        // Add a smooth effect to the popup
        alertContainer.style.opacity = 0;
        setTimeout(() => {
            alertContainer.style.opacity = 1;
        }, 100);

        // Remove the popup after 3 seconds
        setTimeout(() => {
            alertContainer.remove();
        }, 3000);

        return;
    }

    // Generate the birth certificate using a template engine like Handlebars
    const template = `
        <div class="certificate">
            <p>यो प्रमाणपत्र प्रमाणित गर्छ कि <span> <u> {{name}} </u> </span> को जन्म मिति 
            <span> <b> {{date}} </b> </span> मा <span> <b> <u>{{birth-address}}</u> </b> </span> 
            मा भएको हो।
            बubाको नाम <span> <b> <u>{{father-name}} </u> </b> </span> र आमाको नाम <span> <b> <u>{{mother-name}}</u> </b> </span> हो। लिङ्ग [लिङ्ग] हो। 
            यो प्रमाणपत्र [जन्म दर्ता कार्यालयको नाम] द्वारा जारी गरिएको हो
            र प्रमाणित गरिएको मिति <span> <b> {{date}} </b> </span> हो।
            प्रमाणपत्र नम्बर <span> <b> {{date}} </b> </span> हो। यो प्रमाणपत्र बच्चाको पहिचान
            प्रमाणित गर्ने आधिकारिक कागजात हो।</p>
        </div>
    `;
    const certificateHtml = template.replace(/{{(.*?)}}/g, (match, key) => certificateData[key]);

    // Add the generated certificate to the container
    certificateContainer.innerHTML = certificateHtml;

    // Add a smooth paper folding effect to the certificate
    certificateContainer.style.height = '0px';
    certificateContainer.style.overflow = 'hidden';
    certificateContainer.style.transition = 'height 0.5s ease-out';

    setTimeout(() => {
        certificateContainer.style.height = 'auto';
    }, 100);

    // Remove existing download button
    const existingDownloadButton = document.getElementById('download-button');
    if (existingDownloadButton) {
        existingDownloadButton.remove();
    }

    // Create a new download button
    const downloadButton = document.createElement('button');
    downloadButton.id = 'download-button';
    downloadButton.textContent = 'Download Certificate';
    downloadContainer.appendChild(downloadButton);

    // Add event listener to download button
    downloadButton.addEventListener('click', () => {
        domtoimage.toPng(certificateContainer)
           .then(function(dataUrl) {
                const link = document.createElement('a');
                link.download = 'birth-certificate.png';
                link.href = dataUrl;
                link.click();
            });
    });
});