$(document).ready(function() 
{
    sio = io('http://127.0.0.1:5000/');
    $('#resetbtn').hide();
    open_conn = true
    client_id = 0
    tweet_count = 0
    tag1_count = 0
    tag2_count = 0
    key1_sentiment = {'pos':0, 'neg':0, 'neut':0}
    key2_sentiment = {'pos':0, 'neg':0, 'neut':0}
    
    $('#sendbtn').on('click', function(){

        if (open_conn)
        {
            console.log('already connected');
        }
        else
        {
            sio.connect('http://127.0.0.1:5000/');
        }
        tag1 = $('#key1').val();
        tag2 = $('#key2').val();
        $('#key1').prop( "disabled", true );
        $('#key2').prop( "disabled", true );
        msg = tag1 + ';' + tag2
        //console.log('sending request for Tweets with Keywords');
        sio.emit('get_stream', {'keys': msg, 'sid':client_id});
        console.log('Sent');
    });

    $('#stopbtn').on('click', function(){
        sio.send("[201] Disconnecting...;" + client_id);
        sio.disconnect();
        open_conn = false
        $('#key1').prop( "disabled", false );
        $('#key2').prop( "disabled", false );
        $('#resetbtn').show();
        console.lo
    });

    $('#resetbtn').on('click', function(){
        $('#key1').val('')
        $('#key2').val('')
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

        col1 = "<div class='col-md-1'>"+ msg.tags +"</div>"
        col2 = "<div class='col-md-1'>"+ link +"</div>"
        col3 = "<div class='col-md-1'>"+ msg.sentiment +"</div>"
        col4 = "<div class='col-md-9'>"+ msg.text +"</div>"
        
        tweet_count += 1
        updateTagSentiment(msg.tags, msg.sentiment)
        $('#tweets_count').text(tweet_count)
        $('#key1_count').text(tag1_count)
        $('#key2_count').text(tag2_count)
        $('#tbody').append(col1 + col2 + col3 + col4 + "<hr/>")
        
        console.log('tweet # '+tweet_count+' recieved from the server.')
    });

    sio.on('disconnect', function() {
        console.log('disconnected');
        $('#messages').append('<li>['+ (new Date).toLocaleString() +'] Disconnected from the server.</li>');
    });

});

function updateTagSentiment(tag, sentiment)
{
    if (tag.toLowerCase() == $('#key1').val().toLowerCase())
    {
        tag1_count += 1
        if(sentiment.toLowerCase() == 'positive')
        {
            console.log('Found Positive for ' + tag);
            key1_sentiment['pos'] += 1
            $('#key1_pos').text(key1_sentiment['pos'])
        }
        else if(sentiment.toLowerCase() == 'negative')
        {
            key1_sentiment['neg'] += 1
            $('#key1_neg').text(key1_sentiment['neg'])
        }
        else
        {
            key1_sentiment['neut'] += 1
            $('#key1_neut').text(key1_sentiment['neut'])
        }
    }
    else
    {
        tag2_count += 1
        if(sentiment.toLowerCase() == 'positive')
        {
            console.log('Found Positive for ' + tag);
            key2_sentiment['pos'] += 1
            $('#key2_pos').text(key2_sentiment['pos'])
        }
        else if(sentiment.toLowerCase() == 'negative')
        {
            key2_sentiment['neg'] += 1
            $('#key2_neg').text(key2_sentiment['neg'])
        }
        else
        {
            key2_sentiment['neut'] += 1
            $('#key2_neut').text(key2_sentiment['neut'])
        }
    }
    
}

