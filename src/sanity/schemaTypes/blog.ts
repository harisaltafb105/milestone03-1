export const blog={
    name:"blog",
    title:"blog",
    type:"document",

fields:[
{
    name:'Title',
    type:"string",
    title:"Title"
},

{
    name:'Paragraph',
    type:"text",
    title:"Paragraph",
},
{
    name:"slug",
    type:"slug",
    title:"Slug",
    options:{
        source:"Title",
    }
},
{
    title:"Image",
    name:"image",
    type:"image",
    options:{
        hotspot:'true',
    }
},
{
    title: "Block",
    name: "block",
    type:"array",
    of: [{type:'block'}]
},

]




}