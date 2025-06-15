export class ApiFeatures {
    constructor(mongooseQuery, queryString) {
      this.mongooseQuery = mongooseQuery;
      this.queryString = queryString;
    }
  
    pagination() {
      let page = parseInt(this.queryString.page, 10) || 1;
      if (page < 1) page = 1;
  
      const limit = parseInt(this.queryString.limit, 10) || 10;
      const skip = (page - 1) * limit;
  
      this.mongooseQuery.skip(skip).limit(limit); 
      return this;
    }
  
    filter() {
      const excludeQuery = ["page", "search", "sort", "select", "limit"];
      const filterQuery = { ...this.queryString };
  
      excludeQuery.forEach((field) => delete filterQuery[field]);
  
      const queryStr = JSON.stringify(filterQuery).replace(
        /\b(gt|gte|lt|lte|eq)\b/g,
        (match) => `$${match}`
      );
  
      const filterObj = JSON.parse(queryStr);
  
      this.mongooseQuery.find(filterObj); 
      return this;
    }
  
    sort() {
      if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(",").join(" ");
        this.mongooseQuery.sort(sortBy);
      }
      return this;
    }
  
    search() {
      if (this.queryString.search) {
        this.mongooseQuery.find({
          $or: [
            { description: { $regex: this.queryString.search, $options: "i" } },
            { tags: { $regex: this.queryString.search, $options: "i" } },
          ],
        });  
      }
      return this;
    }
  
    select() {
      if (this.queryString.select) {
        const fields = this.queryString.select.split(",").join(" ");
        this.mongooseQuery.select(fields); 
      }
      return this;
    }
  }
  