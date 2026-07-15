"use client";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {contactSchema,type ContactInput} from "@/lib/contact-schema";

export function ValidatedContactForm(){
  const[complete,setComplete]=useState(false);
  const[serverError,setServerError]=useState("");
  const{register,handleSubmit,formState:{errors,isSubmitting},reset}=useForm<ContactInput>({resolver:zodResolver(contactSchema),defaultValues:{website:""}});
  const submit=async(data:ContactInput)=>{
    setServerError("");
    try{
      const response=await fetch("/api/contact",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(data)});
      if(!response.ok){setServerError(response.status===429?"Too many messages have been submitted. Please wait a minute and try again.":"Your message could not be sent right now. Please try again later.");return}
      setComplete(true);
      reset();
    }catch{
      setServerError("Your message could not be sent right now. Please check your connection and try again.");
    }
  };
  if(complete)return <div className="success" role="status"><span>✓</span><h2>Thank you. Your message has been sent.</h2><p>Your inquiry was delivered privately. A response is not guaranteed.</p><button onClick={()=>setComplete(false)}>Submit another message</button></div>;
  return <form className="contact-form" onSubmit={handleSubmit(submit)} noValidate>
    <div className="form-grid">
      <label>Name<input autoComplete="name" maxLength={80} {...register("name")} aria-invalid={!!errors.name}/>{errors.name&&<small role="alert">{errors.name.message}</small>}</label>
      <label>Email<input type="email" autoComplete="email" maxLength={254} {...register("email")} aria-invalid={!!errors.email}/>{errors.email&&<small role="alert">{errors.email.message}</small>}</label>
      <label>Organization <small>(optional)</small><input autoComplete="organization" maxLength={120} {...register("organization")} aria-invalid={!!errors.organization}/>{errors.organization&&<small role="alert">{errors.organization.message}</small>}</label>
      <label>Subject<input maxLength={120} {...register("subject")} aria-invalid={!!errors.subject}/>{errors.subject&&<small role="alert">{errors.subject.message}</small>}</label>
    </div>
    <div className="contact-honeypot" aria-hidden="true"><label>Website<input tabIndex={-1} autoComplete="off" maxLength={200} {...register("website")}/></label></div>
    <label>Message<textarea maxLength={3000} {...register("message")} rows={7} aria-invalid={!!errors.message}/>{errors.message&&<small role="alert">{errors.message.message}</small>}</label>
    {serverError&&<p role="alert" aria-live="polite">{serverError}</p>}
    <button className="button primary" disabled={isSubmitting} type="submit" aria-busy={isSubmitting}>{isSubmitting?"Sending…":"Request connection"}<span>↗</span></button>
    <p className="form-note">Your email is used only to reply to this inquiry. Contact details are not displayed publicly.</p>
  </form>;
}
