// Fix all shortUrls - rebuild them using shortCode with localhost:5000
db.urls.find({}).forEach(function(doc) {
  var newShortUrl = 'http://localhost:5000/' + doc.shortCode;
  db.urls.updateOne({ _id: doc._id }, { $set: { shortUrl: newShortUrl } });
  print('Fixed: ' + doc.shortCode + ' -> ' + newShortUrl);
});

var total = db.urls.countDocuments();
print('\nTotal URLs in database: ' + total);
