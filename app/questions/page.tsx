
"use client";
import {useState} from "react";import {useRouter} from "next/navigation";
import {questions} from "./questions";import {Answers} from "./types";
const times=["Less than a week","A couple of weeks","A couple of months","A year","2 years","More than 5 years"];
export default function Page(){const r=useRouter();const[q,setQ]=useState(0);const[m,setM]=useState("");
const[a,setA]=useState<Answers>({name:"",age:"",diagnosis:[],diagnosisLength:{},medications:[],familyHistory:{hasHistory:false,details:""}});
const cur=questions[q];
const next=()=>q<questions.length-1?setQ(q+1):(console.log(a),r.push("/dashboard"));
const back=()=>q&&setQ(q-1);
const ok=()=>true;
return <main className="min-h-screen flex items-center justify-center bg-gray-50 p-8"><div className="bg-white p-8 rounded-xl shadow w-full max-w-2xl text-gray-900">
<p className="text-gray-700">Question {q+1} of {questions.length}</p><div className="h-2 bg-gray-200 rounded my-4"><div className="h-2 bg-blue-600 rounded" style={{width:`${(q+1)/questions.length*100}%`}}/></div>
<h1 className="text-3xl font-bold mb-6">{cur.title}</h1>
{cur.type==="text"&&<input className="w-full border rounded p-3" value={a.name} onChange={e=>setA({...a,name:e.target.value})}/>}
{cur.type==="select"&&<select className="w-full border rounded p-3" value={a.age} onChange={e=>setA({...a,age:e.target.value})}><option value="">Select age</option>{cur.options?.map(o=><option key={o}>{o}</option>)}</select>}
{cur.type==="multiChoice"&&<div className="grid gap-3">{cur.options?.map(o=>{const s=a.diagnosis.includes(o);return <button key={o} onClick={()=>setA({...a,diagnosis:s?a.diagnosis.filter(x=>x!==o):[...a.diagnosis,o]})} className={`border rounded p-3 text-left ${s?"bg-blue-600 text-white":"bg-white"}`}>{o}</button>})}</div>}
{cur.type==="diagnosisTime"&&a.diagnosis.map(d=><div key={d} className="flex justify-between mb-3"><span>{d}</span><select value={a.diagnosisLength[d]||""} onChange={e=>setA({...a,diagnosisLength:{...a.diagnosisLength,[d]:e.target.value}})}>{["",...times].map(t=><option key={t} value={t}>{t||"Select..."}</option>)}</select></div>)}
{cur.type==="medications"&&<div><div className="flex gap-2"><input className="border rounded p-2 flex-1" value={m} onChange={e=>setM(e.target.value)}/><button className="bg-blue-600 text-white px-4 rounded" onClick={()=>{if(m.trim()){setA({...a,medications:[...a.medications,m.trim()]});setM("")}}}>Add</button></div><ul className="mt-4 list-disc ml-5">{a.medications.map(x=><li key={x}>{x}</li>)}</ul></div>}
{cur.type==="familyHistory"&&<div><div className="flex gap-3"><button className="border p-3 rounded" onClick={()=>setA({...a,familyHistory:{...a.familyHistory,hasHistory:true}})}>Yes</button><button className="border p-3 rounded" onClick={()=>setA({...a,familyHistory:{hasHistory:false,details:""}})}>No</button></div>{a.familyHistory.hasHistory&&<textarea className="border rounded p-3 w-full mt-4" value={a.familyHistory.details} onChange={e=>setA({...a,familyHistory:{...a.familyHistory,details:e.target.value}})}/>}</div>}
<div className="flex justify-between mt-8"><button onClick={back}>Back</button><button onClick={next} disabled={!ok()} className="bg-blue-600 text-white px-4 py-2 rounded">{q===questions.length-1?"Finish":"Next"}</button></div>
</div></main>}
