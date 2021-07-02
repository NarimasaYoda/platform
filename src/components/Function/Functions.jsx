export const toBlobFunction = (base64) => {
    const bin = atob(base64.replace(/^.*,/, ''));
    const buffer = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
    }
    // Blobを作成
    try {
        var blob = new Blob([buffer.buffer], {
            type: 'image/png'
        });
    } catch (e) {
        return false;
    }
    return blob;
}

export const getModalStyle = (top,left) => {
    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}