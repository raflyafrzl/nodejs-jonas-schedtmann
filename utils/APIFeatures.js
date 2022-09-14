class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    console.log(this.query);
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excluded = ['page', 'sort', 'limit', 'fields'];
    excluded.forEach(el => delete queryObj[el]);

    //2) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    //akan menambahkan method baru ke object
    //lakukan parse karena sebelumnya String
    this.query = this.query.find(JSON.parse(queryStr));

    return this;
    //return Query Object
    // let query = Tour.find(JSON.parse(queryStr));
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      //karena sort akan bernilai 'price' maka mongoose akan melakukan sorting berdasarkan price

      this.query = this.query.sort(sortBy);
      //sort('price ratingsAverage') <== untuk melakukan sorting dalam 2 kondisi
    } else {
      this.query = this.query.sort('-createdAt _id');
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    // //jadi ketika tidak menspesifikasikan limit maka limit akan 100(100 data)

    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    // if (this.queryString.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skip >= numTours) throw new Error('This page is not exist');
    // }
    return this;
  }
}
module.exports = APIFeatures;
