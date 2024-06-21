import { io } from 'socket.io-client';
import { promptInput } from './utils/prompts';

// Replace with the actual IP address of the server machine
const serverAddress = 'http://172.16.0.222:8081';

const socket = io(serverAddress);

socket.on('connect', async() => {
    console.log('Connected to server');
    // socket.send("Hello Server, Rohit this side");
    const userId = await promptInput("Enter email: ");
    const password = await promptInput("Enter Password: ");
    socket.emit("Authenticate",{userId:userId,password:password})
    
});


socket.on("Authenticate",async({options})=>{
    options.forEach((option:string, index:number) => {
        console.log(`${index + 1}: ${option}`);
    });
    const index = await promptInput("Select Option: ")
    const name = await promptInput("Enter food Item: ")
    const price = await promptInput("Enter price: ")
    const availabilityStatus = await promptInput("Enter Availability status: ")
    const categoryId = await promptInput("Enter Category ID: ");
    socket.emit("Option selection",{selectedOption:index,payload:{categoryId,name,price,availabilityStatus}})
})

socket.on("Option Selection",(data)=>{
    console.log(data.message)
})


socket.on('disconnect', () => {
    console.log('Disconnected from server');
});
