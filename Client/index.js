$(document).ready(function() 
{
    sio = io('ws://127.0.0.1:5000/');
    open_conn = true
    client_id = 0
    
    $('#sendbtn').on('click', function(){

        if (open_conn)
        {
            console.log('already connected');
        }
        else
        {
            sio.connect('ws://127.0.0.1:5000/');
        }
        msg = $('#key1').val() + ';' + $('#key2').val();
        sio.emit('get_stream', {'keys': msg, 'sid':client_id});
    });

    sio.on('connect', function() {
        console.log('connected');
        $('#messages').append('<li>['+ (new Date).toLocaleString() +'] Connected to the server</li>');
        sio.send("[200] Client has connected to the server!"); 
    });

    sio.on('message', function(msg) {

        if(msg.includes('[300]') && client_id == 0 )
        {
            client_id = msg.split(':')[1];
            console.log("Connected with server with client ID: " + client_id);
            // console.log("SID: " +sid);

            $(document).prop('title', client_id + ":SocketIO"); //$('#title').val(client_id + ":Socket IO:")
        }
        else
            console.log("Message Recieved from server: " + msg);
    });

    sio.on('json', function(msg) {
        
        console.log('JSON recieved from the server: ' + msg.id);
    });

    sio.on('tweets', function(msg) {
        link = '<a href="https://twitter.com/i/web/status/'+msg.id+'">Twitter Link</a>'
        $('#tbody').append('<tr><td>'+ msg.tags +'</td><td>'+ link +'</td><td>'+ msg.text +'</td></tr>')
        console.log('tweet recieved from the server.')
    });
    
    $('#stopbtn').on('click', function(){
        sio.send("[201] Disconnecting...;" + client_id);
        sio.disconnect();
        open_conn = false
    });

    sio.on('disconnect', function() {
        console.log('disconnected');
        $('#messages').append('<li>['+ (new Date).toLocaleString() +'] Disconnected from the server.</li>');
    });

});

