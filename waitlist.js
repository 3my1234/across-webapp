(() => {
 const form=document.getElementById("waitlistForm");if(!form)return;
 const button=form.querySelector('button[type="submit"]'),message=document.getElementById("waitlistMessage");
 form.addEventListener("submit",async event=>{
  event.preventDefault();if(button.disabled)return;if(!form.reportValidity())return;
  button.disabled=true;button.textContent="Joining...";message.textContent="";
  const fields=new FormData(form),params=new URLSearchParams(location.search);
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),15000);
  try{
   const response=await fetch("https://api.atlxpres.com/api/v1/waitlist",{method:"POST",signal:controller.signal,headers:{"Content-Type":"application/json"},body:JSON.stringify({email:fields.get("email"),name:fields.get("name"),phone:fields.get("phone"),interest:fields.get("interest"),consent:fields.get("consent")==="on",website:fields.get("website"),source:(params.get("utm_source")||"website").slice(0,100)})});
   const body=await response.json().catch(()=>({}));if(!response.ok)throw new Error(body.message||"We couldn't save your signup. Please retry.");
   message.textContent=body.message;message.dataset.state="success";form.reset();button.textContent="You're on the list";
  }catch(error){message.textContent=error.name==="AbortError"?"The connection timed out. Please try again; signing up twice won't create duplicates.":error.message||"Please check your connection and try again.";message.dataset.state="error";button.textContent="Join the waitlist";}
  finally{clearTimeout(timeout);button.disabled=false;}
 });
})();
