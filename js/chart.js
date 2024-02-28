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
    endtime = 0;
    lncounter = 0;

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
        if ((time + length) * this.mspb > this.endtime) {
            this.endtime = (time + length) * this.mspb;
        }
        if (length > 0) {
            this.lncounter++;
        }
        this.notes.push(new Note(lane, time * this.mspb, length * this.mspb))
    }
    /**
     * @param { number } lane 
     * @param { number } time 
     * @param { number } length 
     */
    addNoteMS(lane, time, length=0) {
        if (time + length > this.endtime) {
            this.endtime = time + length;
        }
        if (length > 0) {
            this.lncounter++;
        }
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
        return this.notes.length;
    }
    getNotes() {
        return this.notes.length + this.lncounter;
    }

    getEndTime() {
        return this.endtime;
    }

    /**
     * @param { string } text 
     */
    static loadChart(text) {
        let lines = text.split("\n");

        let chart = new Chart("null", "null", "null", null);

        let metadata = true;
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];

            if (metadata) {
                const value = line.substring(line.indexOf("=") + 1, line.length);
                const name = line.substring(0, line.indexOf("="));
                console.log(value, name);
                let set = false;
                switch (name) {
                    case ".title":
                        chart.title = value;
                        set = true;
                        break;
                    case ".artist":
                        chart.artist = value;
                        set = true;
                        break;
                    case ".author":
                        chart.author = value;
                        set = true;
                        break;
                    case ".audio":
                        chart.audio = Main.loadAudio(value);
                        set = true;
                        break;
                    case ".eom" || ".endofmeta":
                        metadata = false;
                        set = true;
                        break;
                }
                if (set) {
                    continue;
                }
            }

            if (line.startsWith(";"))
                continue;

            const sequence = line.split(",");
            if (sequence[0].endsWith("BPM")) {
                chart.setBPM(sequence[0].substring(0, sequence[0].length - 3));
                console.log("BPM Change");
            } else {
                if (sequence.length > 1) {
                    chart.addNoteBeat(
                        parseInt(sequence[0]) % 5,
                        parseFloat(sequence[1]),
                        sequence.length >= 3? parseFloat(sequence[2]) : 0,
                    )
                }
            }
        }
        chart.sort();

        console.log(chart);
        return chart;
    }
}
class Pack {

}