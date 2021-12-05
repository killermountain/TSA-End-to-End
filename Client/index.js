$(document).ready(function() 
{
    sio = io('http://127.0.0.1:5000/');
    open_conn = true
    
    $('#sendbtn').on('click', function(){

        if (open_conn)
        {
            console.log('already connected');
        }
        else
        {
            sio.connect('http://127.0.0.1:5000/');
        }
        msg = $('#key1').val() + ';' + $('#key2').val();
        sio.emit('get_stream', {'keys': msg});
    });

    sio.on('connect', function() {
        console.log('connected');
        $('#messages').append('<li>['+ (new Date).toLocaleString() +'] Connected to the server</li>');
        sio.send("[200] Client has connected to the server!"); 
    });

    sio.on('message', function(msg) {
        
        console.log('message recieved from the server: ' + msg);
    });

    sio.on('tweets', function(msg) {
        link = '<a href="https://twitter.com/i/web/status/'+msg.id+'">Twitter Link</a>'
        $('#tbody').append('<tr><td>'+ msg.tags +'</td><td>'+ link +'</td><td>'+ msg.text +'</td></tr>')
        console.log('tweet recieved from the server.')
    });
    

    $('#stopbtn').on('click', function(){
        sio.send("[201] Disconnecting...");
        sio.disconnect();
        open_conn = false
    });

    sio.on('disconnect', function() {
        console.log('disconnected');
        $('#messages').append('<li>['+ (new Date).toLocaleString() +'] Disconnected from the server.</li>');
    });

});

