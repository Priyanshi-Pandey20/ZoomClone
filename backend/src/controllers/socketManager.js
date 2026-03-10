import {Server} from "socket.io";

//these are global objects
let connections ={}     //this is the connection array store data according to room wise
let messages = {}       //in this according to room the msg are stored
let timeOnline = {}     //it maintain the time which time msg came



const connectToSocket = (server) => {  //this function connects socket.io to http server
    const io = new Server(server, {     //create socket.io instance
        cors:{
            origin: "*",                 //allow any request from frontend
            methods: ["GET", "POST"],      
            allowedHeaders: ["*"],  
            credentials: true           //allow cookies if needed
        }
    });

    io.on("connection", (socket) => {      //this runs every time a new user connects each user get socket id

        console.log("Something connected")
    
        socket.on("join-call", (path) => {    //client want to join a specific room 
          
            if(connections[path] === undefined){  //create room if not exists 
                connections[path] = []
            }
            connections[path].push(socket.id)

            timeOnline[socket.id] = new Date();

            for(let a = 0; a < connections[path].length; a++){
                io.to(connections[path][a]).emit("user-joined", socket.id,connections[path])
            }

            if(messages[path] !== undefined){
             for(let a = 0; a < messages[path].length; ++a){
                io.to(socket.id).emit("chat-message", messages[path][a]['data'],
                    messages[path][a]['sender'], messages[path][a]['socket-id-sender'])

             }
            }


        })

        socket.on("signal",(toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        })
        socket.on("chat-message",(data, sender) => {

            const [matchingRoom, found] = Object.entries(connections)
            .reduce(([room, isFound], [roomKey, roomValue]) => {

                if(!isFound && roomValue.includes(socket.id)){
                    return [roomKey, true];
                }

                return [room, isFound];
            }, ['', false]);

            if(found === true){
                if(messages[matchingRoom] === undefined){
                    messages[matchingRoom] =[]
                }
                messages[matchingRoom].push({'sender': sender, "data": data, "socket-id-sender":socket.id})
                console.log("message", matchingRoom,":",sender,data)

                connections[matchingRoom].forEach((elem) => {
                    io.to(elem).emit("chat-message", data, sender, socket.id)
                })
            }

        })
        socket.on("disconnect", () =>{
         
         var diffTime = Math.abs(timeOnline[socket.id] - new Date())
         var key 
         
         for(const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))){
            for(let a = 0; a < v.length; ++a){
                if(v[a] === socket.id){
                    key = k

                    for(let a = 0; a< connections[key].length; ++a){
                        io.to(connections[key][a]).emit('user-left', socket.id)
                    }

                    var index = connections[key].indexOf(socket.id)

                    connections[key].splice(index, 1)

                    if(connections[key].length === 0){
                        delete connections[key]
                    }
                }
            }
         }
        })
    
    })
    return io;
}
export default connectToSocket;