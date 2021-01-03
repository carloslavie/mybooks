const express = require("express");
const mysql = require("mysql");
const util = require("util");

const app = express();
const port = process.env.PORT ? process.env.PORT : 3000;

//app.use("/static", express.static("public"));
//app.use(express.urlencoded());
app.use(express.json());

// Conexion con mysql

const conexion = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "mybooks"
});

conexion.connect((error)=>{
    if(error){
        throw error;
    }
    console.log ("conexion con la Base de Datos establecida");
});

    const qy = util.promisify(conexion.query).bind(conexion); //permite el uso de async-await en la conexion mysql



    /*CATEGORIA



    POST '/categoria' recibe: {nombre: string} retorna: status: 200, {id: numerico, nombre: string} - status: 413, {mensaje: <descripcion del error>} que puede ser: "faltan datos", "ese nombre de categoria ya existe", "error inesperado"*/
    
    app.post("/categoria", async (req, res)=>{
        try{
            //valido que me envie correctamente la info
            if(!req.body.nombre){
                throw new Error("Falta enviar el nombre");
               }
   
           //verifico que no existe ese genero previamente
           let query = "SELECT id FROM genero WHERE nombre = ?";
           let respuesta = await qy(query, [req.body.nombre.toUpperCase()]);
   
           if(respuesta.length > 0){
               throw new Error("Esa categoria ya existe");
           }
           
           //Guardo el nuevo genero
           query = "INSERT INTO genero (nombre) VALUE (?)";
           respuesta = await qy(query, [req.body.nombre.toUpperCase()]);
            
           query = "SELECT * FROM genero WHERE nombre = ?";
           respuesta = await qy(query, [req.body.nombre])
           res.status(200).send({"respuesta" : respuesta});

    }
    catch(e){
        console.error(e.message);
        res.status(413).send({"Error" : e.message});
    }
    });
    
    
    //GET '/categoria' retorna: status 200  y [{id:numerico, nombre:string}]  - status: 413 y []
    
    app.get("/categoria", async (req, res)=>{ //para pedir todas las categorias
    try{
        const query = "SELECT * FROM genero";
        const respuesta = await qy(query);

        res.status(200).send({"Respuesta" : respuesta});
      
    }

    catch(e){
        console.error(e.message);
        res.status(413).send({"Error" : e.message});
    }
    });
    
    
    //GET '/categoria/:id' retorna: status 200 y {id: numerico, nombre:string} - status: 413, {mensaje: <descripcion del error>} que puede ser: "error inesperado", "categoria no encontrada"
    
    app.get("/categoria/:id", async (req, res)=>{//para pedir solo una categoria
    try{
        if(!req.params.id){
            throw new Error("No completaste el campo de busqueda");
        }
        const query = "SELECT * FROM genero WHERE id = ?";
        const respuesta = await qy(query, [req.params.id]);

        if(respuesta.length == 0){
        throw new Error("Esa categoria no se encuentra");
        }

        res.status(200).send({"respuesta" : respuesta});
    }



    catch(e){
        console.error(e.message);
        res.status(413).send({"Error" : e.message});
    }
});

    
    //DELETE '/categoria/:id' retorna: status 200 y {mensaje: "se borro correctamente"} - status: 413, {mensaje: <descripcion del error>} que puese ser: "error inesperado", "categoria con libros asociados, no se puede eliminar", "no existe la categoria indicada"
    
    app.delete("/categoria/:id", async (req, res)=>{
    try{
        query = "DELETE FROM genero WHERE id = ?";

         respuesta = qy(query, [req.params.id]);

         res.status(200).send("Se borro correctamente");
         

     }
     catch(e){
        console.error(e.message);
        res.status(413).send({"Error" : e.message});
    }
});
    
    //No se debe implementar el PUT
    
    
    
    
    
    
    
    //PERSONA
    
    //POST '/persona' recibe: {nombre: string, apellido: string, alias: string, email: string} retorna: status: 200, {id: numerico, nombre: string, apellido: string, alias: string, email: string} - status: 413, {mensaje: <descripcion del error>} que puede ser: "faltan datos", "el email ya se encuentra registrado", "error inesperado"
    
    app.post("/persona", async (req, res)=>{
        try{
            //valido que me envie correctamente la info
            if(!req.body.nombre||!req.body.apellido||!req.body.email||!req.body.alias){
                throw new Error("Faltaron completar datos");
               }
   
           //verifico que no existe ese email previamente
           let query = "SELECT id FROM personas WHERE email = ?";
           let respuesta = await qy(query, [req.body.email]);
   
           if(respuesta.length > 0){
               throw new Error("Ese email ya existe");
           }
           
           //Guardo la nueva persona
           query = "INSERT INTO personas (nombre, apellido, alias, email) VALUE (?,?,?,?)";
           respuesta = await qy(query, [req.body.nombre.toUpperCase(), req.body.apellido.toUpperCase(), req.body.alias.toUpperCase(), req.body.email]);
            
           query = "SELECT * FROM personas WHERE nombre = ?";
           respuesta = await qy(query, [req.body.nombre])
           res.status(200).send({"respuesta" : respuesta});

    }
    catch(e){
        console.error(e.message);
        res.status(413).send({"Error" : e.message});
    }
    });
    
    
    //GET '/persona' retorna status 200 y [{id: numerico, nombre: string, apellido: string, alias: string, email; string}] o bien status 413 y []
    
    app.get("/persona", async (req, res)=>{ //para pedir todas las personas
    try{
        const query = "SELECT * FROM personas";
        const respuesta = await qy(query);

        res.status(200).send({"Respuesta" : respuesta});
      
    }

    catch(e){
        console.error(e.message);
        res.status(413).send({"Error" : e.message});
    }
    });
    
    
    //GET '/persona/:id' retorna status 200 y {id: numerico, nombre: string, apellido: string, alias: string, email; string} - status 413 , {mensaje: <descripcion del error>} "error inesperado", "no se encuentra esa persona"
    
    app.get("/persona/:id", async (req, res)=>{//para pedir solo una persona
    try{
        if(!req.params.id){
            throw new Error("No completaste el campo de busqueda");
        }
        const query = "SELECT * FROM personas WHERE id = ?";
        const respuesta = await qy(query, [req.params.id]);

        if(respuesta.length == 0){
        throw new Error("Esa persona no se encuentra");
        }

        res.status(200).send({"respuesta" : respuesta});
    }



    catch(e){
        console.error(e.message);
        res.status(413).send({"Error" : e.message});
    }
});
    
    
   // PUT '/persona/:id' recibe: {nombre: string, apellido: string, alias: string, email: string} el email no se puede modificar. retorna status 200 y el objeto modificado o bien status 413, {mensaje: <descripcion del error>} "error inesperado", "no se encuentra esa persona"
    
    app.put("/persona/:id" , async (req, res)=>{ //Para modificar una persona
    try{
        if(req.body.email){
            throw new Error("El campo mail no se puede modificar")
        }
        if(!req.body.nombre || !req.body.apellido || !req.body.alias){
            throw new Error("No completaste los campos");
        }

        let query = "SELECT * FROM personas WHERE nombre = ? AND apellido = ? AND alias = ? AND id <> ?";
        let respuesta = await qy(query, [req.body.nombre, req.body.apellido, req.body.alias, req.params.id]);

       
        if(respuesta.length >0){
            throw new Error("La persona que queres ingresar ya existe");
        }

        query = "UPDATE personas SET nombre = ?, apellido = ?, alias = ?";
        respuesta = await qy(query, [req.body.nombre.toUpperCase(), req.body.apellido.toUpperCase(), req.body.alias.toUpperCase()]);

        query = "SELECT * FROM personas WHERE id = ?";
        respuesta = await qy(query, [req.params.id]);
        res.status(200).send({"Respuesta" : respuesta});
       
       }
       catch(e){
           console.error(e.message);
           res.status(413).send({"Error" : e.message});
       }


});
   
   // DELETE '/persona/:id' retorna: 200 y {mensaje: "se borro correctamente"} o bien 413, {mensaje: <descripcion del error>} "error inesperado", "no existe esa persona", "esa persona tiene libros asociados, no se puede eliminar"
    
    
    app.delete("/persona/:id", async (req, res)=>{
    try{
        query = "DELETE FROM personas WHERE id = ?";

         respuesta = qy(query, [req.params.id]);

         res.status(200).send("Se borro correctamente");
         

     }
     catch(e){
        console.error(e.message);
        res.status(413).send({"Error" : e.message});
    }
});
    
   
   //</descripcion> LIBRO
    
    
    
    //POST '/libro' recibe: {nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null} devuelve 200 y {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null} o bien status 413,  {mensaje: <descripcion del error>} que puede ser "error inesperado", "ese libro ya existe", "nombre y categoria son datos obligatorios", "no existe la categoria indicada", "no existe la persona indicada"
    
    app.post("/libro", async (req, res)=>{
        try{
            //valido que me envie correctamente la info
            if(!req.body.nombre||!req.body.descripcion||!req.body.genero_id){
                throw new Error("Faltaron completar datos");
               }
   
               //verifico que no existe ese libro previamente
               let query = "SELECT id FROM libros WHERE nombre = ?";
               let respuesta = await qy(query, [req.body.nombre.toUpperCase()]);
           
            if(respuesta.length > 0){
                 throw new Error("Ese libro ya existe");
               }
               //verifico que exista el genero
               query = "SELECT id FROM genero WHERE id = ?";
               respuesta = await qy(query, [req.body.genero_id]);
               console.log(respuesta.length);

               if(respuesta.length == 0){
                   throw new Error("ese genero no existe");
               }
               //verifico que exista esa persona
              /*
               
               }*/

              /* let persona = "";

               if(req.body.persona_id){
                   persona = req.body.persona_id;
                   
                   query = "SELECT * FROM personas WHERE id = ?";
               respuesta = await qy(query, persona);
               console.log(respuesta);

               if(respuesta.length == 0){
                   throw new Error("Esa persona no existe");
               }
            }   */ 

               
                
            //Guardo el nuevo libro
                   query = "INSERT INTO libros (nombre, descripcion, genero_id, persona_id) VALUES (?, ?, ?,?)";
                   respuesta = await qy(query, [req.body.nombre.toUpperCase(), req.body.descripcion, req.body.genero_id, req.body.persona_id]);
                    
                   query = "SELECT * FROM libros WHERE nombre = ?";
                   respuesta = await qy(query, [req.body.nombre])
                   res.status(200).send({"respuesta" : respuesta});
        
            }
            catch(e){
                console.error(e.message);
                res.status(413).send({"Error" : e.message});
            }
            });

            //FALTARIA HACER UNA VALIDACION PARA QUE INFORME SI HAY UN GENERO O UNA PERSONA QUE NO EXISTEN
    
    
    //GET '/libro' devuelve 200 y [{id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null}] o bien 413, {mensaje: <descripcion del error>} "error inesperado"
    
    app.get("/libro", async (req, res)=>{ //para pedir todos los libros
    try{
        const query = "SELECT * FROM libros";
        const respuesta = await qy(query);

        res.status(200).send({"Respuesta" : respuesta});
      
    }

    catch(e){
        console.error(e.message);
        res.status(413).send({"Error" : e.message});
    }
    });
    
    
    //GET '/libro/:id' devuelve 200 {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null} y status 413, {mensaje: <descripcion del error>} "error inesperado", "no se encuentra ese libro"
    
    app.get("/libro/:id", async (req, res)=>{//para pedir un solo libro
    try{
        if(!req.params.id){
            throw new Error("No completaste el campo de busqueda");
        }
        const query = "SELECT * FROM libros WHERE id = ?";
        const respuesta = await qy(query, [req.params.id]);

        if(respuesta.length == 0){
        throw new Error("Ese libro no se encuentra");
        }

        res.status(200).send({"respuesta" : respuesta});
    }



    catch(e){
        console.error(e.message);
        res.status(413).send({"Error" : e.message});
    }
});
    
    //PUT '/libro/:id' y {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null} devuelve status 200 y {id: numero, nombre:string, descripcion:string, categoria_id:numero, persona_id:numero/null} modificado o bien status 413, {mensaje: <descripcion del error>} "error inesperado",  "solo se puede modificar la descripcion del libro
    app.put("/libro/:id" , async (req, res)=>{ //Para modificar un libro
   
   try{
        if(!req.body.nombre || !req.body.descripcion || !req.body.genero_id || !req.body.persona_id){
             throw new Error("No completaste los campos");
        }

        let query = "SELECT * FROM libros WHERE nombre = ? AND id <> ?";
        let respuesta = await qy(query, [req.body.nombre, req.params.id]);

       
        if(respuesta.length >0){
            throw new Error("El libro que queres ingresar ya existe");
        }

        query = "UPDATE libros SET nombre = ?, descripcion = ?, genero_id = ?, persona_id = ? WHERE id = ?";
        respuesta = await qy(query, [req.body.nombre.toUpperCase(), req.body.descripcion, req.body.genero_id, req.body.persona_id, req.params.id]);

        query = "SELECT * FROM libros WHERE id = ?";
        respuesta = await qy(query, [req.params.id]);
        res.status(200).send({"Respuesta" : respuesta});
       
       }
       catch(e){
           console.error(e.message);
           res.status(413).send({"Error" : e.message});
       }


});
    
    
   // PUT en '/libro/prestar/:id' y {id:numero, persona_id:numero} devuelve 200 y {mensaje: "se presto correctamente"} o bien status 413, {mensaje: <descripcion del error>} "error inesperado", "el libro ya se encuentra prestado, no se puede prestar hasta que no se devuelva", "no se encontro el libro", "no se encontro la persona a la que se quiere prestar el libro"
    
    
    
 app.put("/libro/prestar/:id" , async (req, res)=>{ //Para modificar el campo persona_id para prestar libro
   
    try{
         if(!req.body.persona_id){
              throw new Error("No completaste los campos");
         }
 
         let query = "SELECT * FROM libros WHERE  id = ?";
         let respuesta = await qy(query, [req.params.id]);
         
         
        
         if(respuesta.length == 0){
             throw new Error("No se encontro el libro");
         }
         
         query = "SELECT * FROM personas WHERE id = ? ";
         respuesta = await qy(query, [req.body.persona_id]);
 
        
         if(respuesta.length == 0){
             throw new Error("No se encontro la persona a la que se quiere prestar el libro");
         }


         query = "SELECT persona_id FROM libros WHERE id = ? AND persona_id IS NULL ";
         respuesta = await qy(query, [req.params.id]);
 
         
        console.log(respuesta.persona_id);
        
         if(respuesta.length == 0 ){
             throw new Error("El libro se encuentra prestado");
         }


         query = "UPDATE libros SET persona_id = ? WHERE id = ?";
         respuesta = await qy(query, [req.body.persona_id, req.params.id]);
 
         query = "SELECT * FROM libros WHERE id = ?";
         respuesta = await qy(query, [req.params.id]);
         res.status(200).send({"El libro fue prestado correctamente" : respuesta});
        
        }
        catch(e){
            console.error(e.message);
            res.status(413).send({"Error" : e.message});
        }
 
 
 });

 //PUT '/libro/devolver/:id' y {} devuelve 200 y {mensaje: "se realizo la devolucion correctamente"} o bien status 413, {mensaje: <descripcion del error>} "error inesperado", "ese libro no estaba prestado!", "ese libro no existe"



 app.put("/libro/devolver/:id" , async (req, res)=>{ //Para modificar el campo persona_id a null para devolver libro)
   
    try{
        if(!req.params.id){
             throw new Error("No completaste el id del libro"); //SI NO LO COMPLETAS NO ME TIRA ESTE ERROR (REVISAR)
        }

        let query = "SELECT persona_id FROM libros WHERE id = ? AND persona_id IS NOT NULL";
        let respuesta = await qy(query, [req.params.id]);
               
       
        if(respuesta.length == 0){
            throw new Error("Ese libro no esta prestado");
        }
        
        
        query = "UPDATE libros SET persona_id = NULL WHERE id = ?";
        respuesta = await qy(query, [req.params.id]);

        query = "SELECT * FROM libros WHERE id = ?";
        respuesta = await qy(query, [req.params.id]);
        res.status(200).send({"El libro fue devuelto correctamente" : respuesta});
       
       }
       catch(e){
           console.error(e.message);
           res.status(413).send({"Error" : e.message});
       }


});
    
    
//    DELETE '/libro/:id' devuelve 200 y {mensaje: "se borro correctamente"}  o bien status 413, {mensaje: <descripcion del error>} "error inesperado", "no se encuentra ese libro", "ese libro esta prestado no se puede borrar"


app.delete("/libro/:id", async (req, res)=>{
    try{
        query = "DELETE FROM libros WHERE id = ?";

         respuesta = qy(query, [req.params.id]);

         res.status(200).send("Se borro correctamente");
         

     }
     catch(e){
        console.error(e.message);
        res.status(413).send({"Error" : e.message});
    }
});






// Servidor
app.listen(port, ()=>{
    console.log("servidor escuchando puerto ", port);
});
