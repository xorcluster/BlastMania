class Note {
    time = 0;
    length = 0;
    lane = 0;

    /**
     * @param { number } lane 
     * @param { number } time 
     * @param { number } length 
     */
    constructor(lane, time, length=0) {
        this.lane = lane;
        this.time = time;
        this.length = length;
    }
}
class Chart {
    /** @type { Array<Note> } */
    notes = new Array();

    /**
     * @param { string } title 
     * @param { string } artist 
     * @param { string } author 
     * @param { string } audio 
     */
    constructor(title, artist, author, audio) {
        this.title = title;
        this.artist = artist;
        this.author = author;
        this.audio = audio;

        this.bpm = 60;
        this.mspb = 0;
        this.offset = 0;

        this.calculateMSPerBeat();
    }

    /**
     * @param { number } lane 
     * @param { number } time 
     * @param { number } length 
     */
    addNoteBeat(lane, time, length=0) {
        this.notes.push(new Note(lane, time * this.mspb, length * this.mspb))
    }
    /**
     * @param { number } lane 
     * @param { number } time 
     * @param { number } length 
     */
    addNoteMS(lane, time, length=0) {
        this.notes.push(new Note(lane, time, length))
    }

    calculateMSPerBeat() {
        this.mspb = (60 / this.bpm) * 1000;
    }

    sort() {
        this.notes.sort((a, b) => a.time > b.time);
    }

    /**
     * @param { number } bpm 
     */
    setBPM(bpm) {
        this.bpm = bpm;
        this.calculateMSPerBeat();
    }

    getTitle() {
        return this.title;
    }
    getArtist() {
        return this.artist;
    }
    getAuthor() {
        return this.author;
    }

    getAudio() {
        return this.audio;
    }

    getSize() {
        return this.notes.length
    }
}