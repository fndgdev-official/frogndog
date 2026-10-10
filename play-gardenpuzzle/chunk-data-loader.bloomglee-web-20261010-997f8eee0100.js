(function (global) {
  "use strict";
  const nativeFetch = global.fetch.bind(global);
  const manifests = new Map();
  let installed = false;
  const MiB = 1024 * 1024;

  function validate(manifest) {
    if (!manifest || manifest.schema !== 1 || typeof manifest.virtualFile !== "string" ||
        !/^[\w.-]+\.data\.unityweb$/.test(manifest.virtualFile) ||
        !Number.isSafeInteger(manifest.totalBytes) || manifest.totalBytes <= 0 ||
        manifest.chunkMaxBytes !== 80 * MiB || !/^[a-f0-9]{64}$/i.test(manifest.originalSha256) ||
        !Array.isArray(manifest.chunks) || !manifest.chunks.length) {
      throw new Error("Invalid BloomGlee data manifest.");
    }
    let sum = 0;
    const names = new Set();
    for (const chunk of manifest.chunks) {
      if (!chunk || typeof chunk.file !== "string" || !/^[\w.-]+$/.test(chunk.file) ||
          names.has(chunk.file) || !Number.isSafeInteger(chunk.bytes) ||
          chunk.bytes <= 0 || chunk.bytes > manifest.chunkMaxBytes ||
          !/^[a-f0-9]{64}$/i.test(chunk.sha256)) {
        throw new Error("Invalid BloomGlee data chunk.");
      }
      names.add(chunk.file);
      sum += chunk.bytes;
    }
    if (!Number.isSafeInteger(sum) || sum !== manifest.totalBytes) {
      throw new Error("BloomGlee data manifest length mismatch.");
    }
  }

  function dataResponse(entry, input, options, method) {
    const manifest = entry.manifest;
    const headers = new Headers({
      "Content-Type": "application/vnd.unity",
      "Content-Length": String(manifest.totalBytes),
      "ETag": '"' + manifest.originalSha256.toLowerCase() + '"'
    });
    const requestHeaders = new Headers(input instanceof Request ? input.headers : undefined);
    if (options.headers) new Headers(options.headers).forEach((value, key) => requestHeaders.set(key, value));
    const conditional = requestHeaders.get("If-None-Match");
    if (conditional && conditional.split(",").some(value => value.trim() === "*" ||
        value.trim().replace(/^W\//, "") === headers.get("ETag"))) {
      return new Response(null, { status: 304, headers });
    }
    if (method === "HEAD") return new Response(null, { status: 200, headers });
    const signal = options.signal || (input instanceof Request ? input.signal : null);
    const abort = new AbortController();
    const abortListener = () => abort.abort(signal.reason);
    if (signal) {
      if (signal.aborted) abortListener();
      else signal.addEventListener("abort", abortListener, { once: true });
    }
    let index = 0, reader = null, chunkBytes = 0, totalBytes = 0;
    const clean = () => { if (signal) signal.removeEventListener("abort", abortListener); };
    const stream = new ReadableStream({
      async pull(controller) {
        try {
          while (true) {
          if (abort.signal.aborted) throw new DOMException("Aborted", "AbortError");
          if (!reader) {
            if (index === manifest.chunks.length) {
              if (totalBytes !== manifest.totalBytes) throw new Error("BloomGlee data total length mismatch.");
              clean();
              controller.close();
              return;
            }
            const chunk = manifest.chunks[index];
            const chunkUrl = new URL(chunk.file, entry.manifestUrl);
            const response = await nativeFetch(chunkUrl.href, { method: "GET", signal: abort.signal,
              credentials: options.credentials || (input instanceof Request ? input.credentials : "same-origin") });
            if (!response.ok) throw new Error("BloomGlee data chunk request failed (" + response.status + ").");
            if (!response.body) throw new Error("Streaming downloads are unavailable in this browser.");
            reader = response.body.getReader();
            chunkBytes = 0;
          }
          const next = await reader.read();
          if (next.done) {
            reader.releaseLock();
            reader = null;
            if (chunkBytes !== manifest.chunks[index].bytes) throw new Error("BloomGlee data chunk length mismatch.");
            index++;
          } else {
            chunkBytes += next.value.byteLength;
            totalBytes += next.value.byteLength;
            if (chunkBytes > manifest.chunks[index].bytes || totalBytes > manifest.totalBytes)
              throw new Error("BloomGlee data chunk exceeds its manifest length.");
            controller.enqueue(next.value);
            return;
          }
          }
        } catch (error) {
          abort.abort();
          if (reader) { try { await reader.cancel(error); } catch (_) {} }
          clean();
          controller.error(error);
        }
      },
      async cancel(reason) {
        abort.abort();
        if (reader) { try { await reader.cancel(reason); } catch (_) {} }
        clean();
      }
    });
    const response = new Response(stream, { status: 200, headers });
    // Unity's cache/progress logic keeps using the stable virtual release URL.
    Object.defineProperty(response, "url", { value: entry.dataUrl });
    return response;
  }

  async function install(options) {
    if (!options || !options.manifestUrl || !options.dataUrl) throw new Error("BloomGlee chunk URLs are required.");
    const manifestUrl = new URL(options.manifestUrl, document.baseURI).href;
    const dataUrl = new URL(options.dataUrl, document.baseURI).href;
    const response = await nativeFetch(manifestUrl);
    if (!response.ok) throw new Error("BloomGlee data manifest unavailable (" + response.status + ").");
    const manifest = await response.json();
    validate(manifest);
    if (new URL(dataUrl).pathname.split("/").pop() !== manifest.virtualFile)
      throw new Error("BloomGlee virtual data URL does not match its manifest.");
    manifests.set(dataUrl, { manifest, manifestUrl, dataUrl });
    if (!installed) {
      global.fetch = function (input, options) {
        options = options || {};
        const rawUrl = input instanceof Request ? input.url : String(input);
        const url = new URL(rawUrl, document.baseURI).href;
        const method = String(options.method || (input instanceof Request ? input.method : "GET")).toUpperCase();
        const entry = manifests.get(url);
        if (entry && (method === "GET" || method === "HEAD")) {
          try { return Promise.resolve(dataResponse(entry, input, options, method)); }
          catch (error) { return Promise.reject(error); }
        }
        return nativeFetch(input, options);
      };
      installed = true;
    }
    return { virtualFile: manifest.virtualFile, totalBytes: manifest.totalBytes, chunks: manifest.chunks.length };
  }
  global.BloomGleeChunkedData = Object.freeze({ install });
})(window);
