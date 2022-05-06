class WebRTC {
    static setIceServers(turnUrl, stunUrl) {
        this.turnUrl = turnUrl;
        this.stunUrl = stunUrl;
    }

    static setTurnAccount(turnAccount) {
        this.turnAccount = turnAccount;
    }

    static offer(stream, iceCandidateCallback) {
        return new Promise((resolve, reject) => {
            try {
                let { username, password } = this.turnAccount;
                let peerConn = new RTCPeerConnection(
                    { 
                        iceServers: [
                            { urls: this.turnUrl, username: username, credential: password },
                            { urls: this.stunUrl }
                        ] 
                    }
                );
    
                stream.getTracks().forEach(track => peerConn.addTrack(track, stream));
                peerConn.onicecandidate = ((event) => {
                    if (event.candidate) {
                        iceCandidateCallback(event.candidate);
                    }
                });

                peerConn.createOffer()
                .then(sdp => peerConn.setLocalDescription(sdp))
                .then(() => resolve(peerConn));
            } catch (error) {
                reject(error);
            }
        });
    }
    
    static answer (remoteDescription, onTrackCallback, iceCandidateCallback) {
        return new Promise((resolve, reject) => {
            try {
                let { username, password } = this.turnAccount;
                let peerConn = new RTCPeerConnection(
                    { 
                        iceServers: [
                            { urls: this.turnUrl, username: username, credential: password },
                            { urls: this.stunUrl }
                        ] 
                    }
                );
    
                peerConn.ontrack = (event) => onTrackCallback(event.streams);
                peerConn.onicecandidate = ((event) => {
                    if (event.candidate) {
                        iceCandidateCallback(event.candidate);
                    }
                });

                peerConn.setRemoteDescription(remoteDescription)
                .then(() => peerConn.createAnswer())
                .then(sdp => peerConn.setLocalDescription(sdp))
                .then(() => resolve(peerConn));
            } catch (error) {
                reject(error);
            }
        });
    }

    static disconnectPeer(peerConn) {
        if (peerConn) {
            peerConn.onicecandidate = null;
            peerConn.ontrack = null;

            if (peerConn.signalingState != 'closed') {
                peerConn.getSenders().forEach(sender => peerConn.removeTrack(sender));
                peerConn.close();
            }

            peerConn = null;
        }
            
        return peerConn;
    }
}

module.exports = { WebRTC };