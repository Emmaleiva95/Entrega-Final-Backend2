export default class UsersDTO{
    constructor(user){
        this._id = user._id;
        this.first_name = user.first_name;
        this.age= user.age;
        this.email= user.email;
        this.cart = user.cart;
    }
}