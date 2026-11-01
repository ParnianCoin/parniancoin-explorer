const P_BUFFER = Symbol('buffer');

/**
 * A ByteCollection value as defined in ParnianCoin. In essence its a wrapper for
 * a buffer.
 */
class ByteCollection {
  /**
     * Constructor
     *
     * @param {Buffer} buffer
     */
  constructor(buffer) {
    this[P_BUFFER] = buffer;
  }

  /**
     * Creates a new ByteCollection instance from the given hex string.
     *
     * @param {string} hex
     * @returns {ByteCollection}
     */
  /**
     * Creates a ByteCollection from a value a node reported. Some nodes hex
     * encode the payload of a block, others hand back the plain text the miner
     * wrote. Reading plain text as hex silently truncates it at the first
     * character that is not a hex digit, so the shape is detected instead of
     * assumed.
     *
     * A payload that is plain text but happens to consist only of hex digits
     * cannot be told apart from real hex; those are read as hex.
     *
     * @param {String|ByteCollection} value
     * @returns {ByteCollection}
     */
  static fromNodeValue(value) {
    if (value instanceof ByteCollection) {
      return value;
    }

    if (typeof value !== 'string' || value === '') {
      return new ByteCollection(Buffer.alloc(0));
    }

    const looksLikeHex = value.length % 2 === 0 && /^[0-9a-fA-F]+$/.test(value);

    return looksLikeHex
      ? ByteCollection.fromHex(value)
      : new ByteCollection(Buffer.from(value, 'utf8'));
  }

  static fromHex(hex) {
    if (hex instanceof ByteCollection) {
      return hex;
    }

    if (hex.length % 2 === 1) {
      hex = `0${hex}`; // eslint-disable-line no-param-reassign
    }

    return new ByteCollection(Buffer.from(hex, 'hex'));
  }

  /**
     * Creates a new ByteCollection instance from the given string.
     *
     * @param {string} str
     * @returns {ByteCollection}
     */
  static fromString(str) {
    if (str instanceof ByteCollection) {
      return str;
    }

    // TODO: UTF8?
    return new ByteCollection(Buffer.from(str));
  }

  /**
     * Gets a new ByteCollection from an integer.
     *
     * @param {Number} int
     * @param {Number} nBytes
     * @returns {ByteCollection}
     */
  static fromInt(int, nBytes = null) {
    const instance = ByteCollection.fromHex(parseInt(int, 10).toString(16));

    if (nBytes !== null && instance.length < nBytes) {
      return instance.prepend(ByteCollection.fromHex('00'.repeat(nBytes - instance.length)));
    }
    return instance;
  }

  /**
     * Gets the binary presentation of the hexa string.
     *
     * @returns {string}
     */
  toBinary() {
    return this[P_BUFFER].toString('binary');
  }

  /**
     * Gets the ByteCollection as a string.
     *
     * @returns {string}
     * // TODO: UTF8?
     */
  toString() {
    return this[P_BUFFER].toString();
  }

  /**
     * Gets the ByteCollection as hex.
     *
     * @returns {string}
     */
  toHex() {
    return this[P_BUFFER].toString('hex').toUpperCase();
  }

  /**
     * Gets the integer value of the ByteCollection.
     *
     * @return {Number}
     */
  toInt() {
    return parseInt(this.toHex(), 16);
  }

  /**
     * Gets the length of ByteCollection bytes.
     *
     * @returns {number}
     */
  get length() {
    return this[P_BUFFER].length;
  }

  /**
     * Gets the length of the parsed ByteCollection (the bytes).
     *
     * @returns {number}
     */
  get hexLength() {
    return this.length * 2;
  }

  /**
     * Gets a copy of the current buffer.
     *
     * @returns {Buffer}
     */
  get buffer() {
    return this[P_BUFFER].slice(0);
  }

  /**
     * Switches the endianness of the ByteCollection.
     *
     * @returns {ByteCollection}
     */
  switchEndian() {
    return ByteCollection.fromHex(
      this[P_BUFFER].toString('hex').match(/../g).reverse().join(''),
    );
  }

  /**
     * Returns a sub-ByteCollection defined by the start and end position.
     *
     * @param {Number}start
     * @param {Number} end
     * @returns {ByteCollection}
     */
  slice(start, end) {
    return new ByteCollection(this[P_BUFFER].slice(start, end));
  }

  /**
     * Concatenates one or more ByteCollection instances and returns a new instance.
     *
     * @param {...ByteCollection} bytes
     * @returns {ByteCollection}
     */
  static concat(...bytes) {
    return ByteCollection.fromHex(bytes.reduce((prev, curr) => {
      if (prev instanceof Object) {
        return `${prev.toHex()}${curr.toHex()}`;
      }
      return `${prev}${curr.toHex()}`;
    }));
  }

  /**
     * Appends a single ByteCollection instance to the current ByteCollection and
     * returns a new instance.
     *
     * @param {ByteCollection} bytes
     * @returns {ByteCollection}
     */
  append(bytes) {
    return ByteCollection.concat(this, bytes);
  }

  /**
     * Appends a single ByteCollection instance to the current ByteCollection and
     * returns a new instance.
     *
     * @param {ByteCollection} bytes
     * @returns {ByteCollection}
     */
  prepend(bytes) {
    return ByteCollection.concat(bytes, this);
  }
}

module.exports = ByteCollection;
