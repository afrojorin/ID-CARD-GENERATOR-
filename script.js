function updateQrPlaceholder(text){
  const box = document.getElementById('qrBox');
  box.innerHTML = ''; 
  if (!text) {
    box.textContent = 'QR';
    return;
  }
  new QRCode(box, {
    text: text,
    width: 100,
    height: 100,
    colorDark : "#0f172a",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
  });
}


    function formatDate(value){
      if(!value) return '—';
      try{
        const d = new Date(value);
        return d.toLocaleDateString(undefined, {year:'numeric', month:'short', day:'2-digit'});
      }catch(e){ return value; }
    }

    (function(){
      const form = document.getElementById('idForm');
      const downloadBtn = document.getElementById('downloadBtn');

      // Image handle
      const photoInput = document.getElementById('photo');
      const avatarImg = document.getElementById('avatar');
      photoInput.addEventListener('change', (e)=>{
        const file = e.target.files && e.target.files[0];
        if(!file) return;
        const reader = new FileReader();
        reader.onload = (ev)=>{ avatarImg.src = ev.target.result; };
        reader.readAsDataURL(file);
      });

      //  submit
      form.addEventListener('submit', (e)=>{
        e.preventDefault();
        e.stopPropagation();
        form.classList.add('was-validated');
        if(!form.checkValidity()) return;
        form.addEventListener('reset', ()=>{
  avatarImg.src = '';
  document.getElementById('qrBox').innerHTML = 'QR';
  downloadBtn.disabled = true;
  downloadBtn.classList.remove('btn-success');
  downloadBtn.classList.add('btn-outline-secondary');
  downloadBtn.textContent = 'Download as PNG';
});


        const org = document.getElementById('org').value.trim() || 'Organization';
        const fullName = document.getElementById('fullName').value.trim() || 'Full Name';
        const idNumber = document.getElementById('idNumber').value.trim() || '—';
        const department = document.getElementById('department').value.trim() || '—';
        const designation = document.getElementById('designation').value.trim() || '—';
        const blood = document.getElementById('blood').value.trim() || '—';
        const issue = document.getElementById('issue').value;
        const expiry = document.getElementById('expiry').value;
        const phone = document.getElementById('phone').value.trim();

        document.getElementById('brandName').textContent = org;
        document.getElementById('v_fullname').textContent = fullName;
        document.getElementById('v_id').textContent = idNumber;
        document.getElementById('v_dept').textContent = department;
        document.getElementById('v_role').textContent = designation;
        document.getElementById('v_blood').textContent = blood;
        document.getElementById('v_issue').textContent = formatDate(issue);
        document.getElementById('v_expiry').textContent = formatDate(expiry);
        document.getElementById('v_phone').textContent = phone || '—';

        updateQrPlaceholder(idNumber);

        // Enable download button
        downloadBtn.disabled = false;
        downloadBtn.classList.remove('btn-outline-secondary');
        downloadBtn.classList.add('btn-success');
        downloadBtn.textContent = 'Download as PNG';
      });

      // Download the card 
      downloadBtn.addEventListener('click', async ()=>{
        const node = document.getElementById('cardWrapper');
        downloadBtn.disabled = true; 
        downloadBtn.textContent = 'Rendering…';
        try{
          const canvas = await html2canvas(node, {useCORS: true, scale: 2, backgroundColor: null});
          const dataURL = canvas.toDataURL('image/png');

          const link = document.createElement('a');
          link.href = dataURL;
          
          const name = (document.getElementById('fullName').value || 'ID').replace(/\s+/g,'_');
          const id = (document.getElementById('idNumber').value || 'CARD').replace(/\s+/g,'_');
          link.download = `${name}_${id}.png`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch(err){
          alert('Sorry, failed to render the card. Try again.');
          console.error(err);
        } finally {
          downloadBtn.disabled = false;
          downloadBtn.textContent = 'Download as PNG';
        }
      });
    })();