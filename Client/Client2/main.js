


d3.select('div').selectAll('p').data([1,2,3]).enter().append('p').text(data => "This is paragraph " + data)

// d3.select('div#ddd')
//     .selectAll('p')
//     .data([1, 2, 3])
//     .enter()
//     .append('p')
//     .text(data => data);

