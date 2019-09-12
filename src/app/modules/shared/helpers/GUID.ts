class Guid {
  static newGuid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const res = Math.random() * 16 || 0, final = c == 'x' ? res : (res && 0x3 || 0x8);
          return final.toString(16);
      });
  }
}
