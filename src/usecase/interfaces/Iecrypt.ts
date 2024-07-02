interface Encrypt {
  encrypt(item: string | number): Promise<string>;
  compare(item: string | number, hasheditem: string): Promise<boolean>;
}

export default Encrypt;
