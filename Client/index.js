
key1_sentiment = {'pos':0, 'neg':0, 'neut':0}
key2_sentiment = {'pos':0, 'neg':0, 'neut':0}

$(document).ready(function() 
{
    sio = io('http://127.0.0.1:5000/');
    $('#resetbtn').hide();
    $('#results_container').hide();
    $('#tweets_table').hide();
    
    open_conn = false;
    client_id = 0
    tweet_count = 0
    tag1_count = 0
    tag2_count = 0
    
    
    var charts = []
    var canvas1 = document.getElementById("key1Chart").getContext('2d');
    var canvas2 = document.getElementById("key2Chart").getContext('2d');
    
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
        $('#keyword1').text(tag1 + ": ");
        $('#keyword2').text(tag2 + ": ");
        $('#key1').prop( "disabled", true );
        $('#key2').prop( "disabled", true );
        msg = tag1 + ';' + tag2

        $('#results_container').show();
        $('#tweets_table').show();
        
        sio.emit('get_stream', {'keys': msg, 'sid':client_id});
        charts = drawCharts(canvas1, canvas2);
        
        console.log('Keywords sent to server for tweets.');
    });

    $('#stopbtn').on('click', function(){
        sio.send("[201] Disconnecting...;" + client_id);
        sio.disconnect();
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
        open_conn = true;
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
        
        updateCharts(charts[0],charts[1]);
        // console.log('tweet # '+tweet_count+' recieved from the server.')
    });

    sio.on('disconnect', function() {
        open_conn = false
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
            // console.log('Found Positive for ' + tag);
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

function drawCharts(canvas1, canvas2)
{
    var chart1 = new Chart(canvas1, {
        type: 'bar',
        data: {
            labels:['positive', 'negative', 'neutral'],
            datasets:[{
                label:$('#key1').val(),
                data:[key1_sentiment['pos'],
                key1_sentiment['neg'],
                key1_sentiment['neut']],
                backgroundColor:'green'
            }]
        },
        options:{}
    });

    var chart2 = new Chart(canvas2, {
        type: 'bar',
        data: {
            labels:['positive', 'negative', 'neutral'],
            datasets:[{
                label:$('#key2').val(),
                data:[key2_sentiment['pos'],
                key2_sentiment['neg'],
                key2_sentiment['neut']],
                backgroundColor:'blue'
            }]
        },
        options:{}
    });

    return [chart1, chart2]
}

function updateCharts(chart1, chart2){
    chart1.data.datasets[0].data = [
        key1_sentiment['pos'],
        key1_sentiment['neg'],
        key1_sentiment['neut']];
    chart1.update();
    chart2.data.datasets[0].data = [
        key2_sentiment['pos'],
        key2_sentiment['neg'],
        key2_sentiment['neut']];
    chart2.update();
}
