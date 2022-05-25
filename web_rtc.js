class WebRTC {
    static setIceServers(turnUrl, stunUrl) {
        this.turnUrl = turnUrl;
        this.stunUrl = stunUrl;
    }

    static setTurnSecret(turnSecret) {
        this.turnSecret = turnSecret;
    }

    static offer(stream, iceCandidateCallback, connectionStateChangeCallback, iceFailureCallback) {
        return new Promise(async (resolve, reject) => {
            try {
                let { username, password } = this.getTurnCredentials(); 
                let peerConn = new RTCPeerConnection(
                    { 
                        iceServers: [
                            { 
                                urls: [this.turnUrl + '?transport=udp', this.turnUrl + '?transport=tcp'], 
                                username: username, 
                                credential: password 
                            },
                            { urls: this.stunUrl }
                        ] 
                    }
                );

                peerConn.oniceconnectionstatechange = (event) => connectionStateChangeCallback(event);

                peerConn.onicecandidate = ((event) => {
                    if (event.candidate) {
                        iceCandidateCallback(event.candidate);
                    }
                });

                peerConn.onicecandidateerror = (event) => iceFailureCallback(event);

                stream.getTracks().forEach(track => peerConn.addTrack(track, stream));

                const offer = await peerConn.createOffer();
                await peerConn.setLocalDescription(offer);

                resolve(peerConn);
            } catch (error) {
                reject(error);
            }
        });
    }
    
    static answer(remoteDescription, onTrackCallback, iceCandidateCallback, connectionStateChangeCallback, iceFailureCallback) {
        return new Promise(async (resolve, reject) => {
            try {
                let { username, password } = this.getTurnCredentials();
                let peerConn = new RTCPeerConnection(
                    { 
                        iceServers: [
                            { 
                                urls: [this.turnUrl + '?transport=udp', this.turnUrl + '?transport=tcp'], 
                                username: username, 
                                credential: password 
                            },
                            { urls: this.stunUrl }
                        ] 
                    }
                );

                peerConn.oniceconnectionstatechange = (event) => connectionStateChangeCallback(event);

                peerConn.onicecandidate = ((event) => {
                    if (event.candidate) {
                        iceCandidateCallback(event.candidate);
                    }
                });

                peerConn.onicecandidateerror = (event) => iceFailureCallback(event);

                peerConn.ontrack = (event) => onTrackCallback(event.streams);
                
                peerConn.setRemoteDescription(new RTCSessionDescription(remoteDescription))
                
                const answer = await peerConn.createAnswer();
                await peerConn.setLocalDescription(answer);
                
                resolve(peerConn);
            } catch (error) {
                reject(error);
            }
        });
    }

    static disconnectPeer(peerConn) {
        if (peerConn) {
            peerConn.oniceconnectionstatechange = null;
            peerConn.onicecandidateerror = null;
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

    /*
        static-auth credentials
        https://eturnal.net/documentation/
        https://datatracker.ietf.org/doc/html/draft-uberti-behave-turn-rest-00
    */
    static getTurnCredentials() {
        let crypto = require('crypto');
        let username = String(parseInt(Date.now() / 1000) + 24 * 3600); //ttl: 24h
        let hmac = crypto.createHmac('sha1', this.turnSecret);

        hmac.setEncoding('base64');
        hmac.write(username);
        hmac.end();

        return { username: username, password: hmac.read() };
    }
}

module.exports = { WebRTC };