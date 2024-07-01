interface Encrypt{
    encrypt(password:string|number):Promise<string>,
    compare(password:string|number,hashedPassword:string):Promise<boolean>
}

export default Encrypt