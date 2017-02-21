// JavaScript Document

 function getObject(id)

{

      var obj = null;



      if(document.getElementById)

           obj = document.getElementById(id);

      else if(document.all)

           obj = document.all[id];

      else if(document.layers)

           obj = document.layers[id];



      return obj;

}





function toggleObject(id)

      {

      var obj = getObject(id);





      if(!obj)

           return false;



      if(obj.style.display == 'none')

      {

           obj.style.display = '';

      }



      else

      {

           obj.style.display = 'none';

      }



      return true;

}