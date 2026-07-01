
import {Question} from "./types";
export const questions:Question[]=[
{id:"name",title:"What is your loved one's name?",type:"text",placeholder:"Enter name"},
{id:"age",title:"How old is your loved one?",type:"select",options:[...Array.from({length:100},(_,i)=>String(i+1)),"100+",],},
{id:"diagnosis",title:"What is your loved one's diagnosis? Select all that apply.",type:"multiChoice",options:["Autism","ADHD","Down Syndrome","Cerebral Palsy","Dyslexia","Intellectual Disability","Undiagnosed","Other"]},
{id:"diagnosisLength",title:"How long has your loved one been diagnosed?",type:"diagnosisTime"},
{id:"medications",title:"What medications does your loved one currently take?",type:"medications"},
{id:"familyHistory",title:"Is there any family history?",type:"familyHistory"},
];
