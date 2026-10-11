// Memory keeps the current session usable when browser storage is unavailable.
export function createSessionStore(getStorage = () => globalThis.localStorage) {
  const memory = new Map();
  const keyFor = (audience) => `fasfoor_${audience}`;
  const read = (key) => {
    if (memory.has(key)) return memory.get(key);
    try { return getStorage()?.getItem(key) ?? null; } catch { return null; }
  };
  const write = (key, value) => {
    try {
      const storage = getStorage();
      if (!storage) throw new Error('Storage unavailable');
      if (value === null) storage.removeItem(key);
      else storage.setItem(key, value);
      memory.delete(key);
    } catch { memory.set(key, value); }
  };
  const clear = (audience) => {
    write(keyFor(audience), null);
    write(`${keyFor(audience)}_token`, null);
  };
  return {
    clear,
    getToken: (audience) => read(`${keyFor(audience)}_token`),
    restore(audience) {
      try {
        const user = JSON.parse(read(keyFor(audience)) || 'null');
        if (user && typeof user === 'object' && !Array.isArray(user) &&
            typeof user._id === 'string' && user._id && read(`${keyFor(audience)}_token`)) return user;
      } catch { /* Invalid cached data must not prevent the app from rendering. */ }
      clear(audience);
      return null;
    },
    save(audience, token, user) {
      write(`${keyFor(audience)}_token`, token);
      write(keyFor(audience), JSON.stringify(user));
    },
  };
}

export const sessionStore = createSessionStore();
