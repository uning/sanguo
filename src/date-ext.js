var monthNames = [ 'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli',
                     'August', 'September', 'Oktober', 'November', 'Dezember' ];
var monthNamesShort = [ 'Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul',
                        'Aug', 'Sep', 'Okt', 'Nov', 'Dez' ];

function padDatePart(part) {
  return (part < 10 ? '0' + part : part);
}

exports.toReadableDate = function(inputDate, formatType) {
  if (inputDate.constructor != (new Date).constructor)
    return '';
  
  var year, month,day,hour,min,sec 
  switch (formatType) {
    case 'fullmonth':
      year = inputDate.getFullYear();
      month = monthNames[inputDate.getMonth()];
      day = inputDate.getDate();
      return padDatePart(day) + '. ' + month + ' ' + year;
    case 'datestamp':
      month = inputDate.getMonth() + 1;
      day = inputDate.getDate();
      hour = inputDate.getHours();
      min = inputDate.getMinutes();
      sec = inputDate.getSeconds();
      return padDatePart(day) + '.' +
        padDatePart(month) + ' @ ' +
        padDatePart(hour) + ':' +
        padDatePart(min) + ':' +
        padDatePart(sec);
    case 'timestamp':
      hour = inputDate.getHours();
      min = inputDate.getMinutes();
      sec = inputDate.getSeconds();
      return padDatePart(hour) + ':' +
        padDatePart(min) + ':' +
        padDatePart(sec);
  }
};

