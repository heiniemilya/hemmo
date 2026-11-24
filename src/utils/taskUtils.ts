import { Task, DueStatus } from "../types/task";

//////// DueDaten vertailu nykyhetkeen DueStatus-tyypin palauttamiseksi //////////
export const getDueInfo = (dueDateStr: string) => {
    const today = new Date(); 
    today.setHours(0, 0, 0, 0); // nollataan kellonaika vertailua varten

    const due = new Date(dueDateStr); // 'YYYY-MM-DD' muotoisen merkkijonon muuntaminen Date-objektiksi
    due.setHours(0, 0, 0, 0);

    const diffTime = due.getTime() - today.getTime(); // lasketaan ero millisekunteina
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // lasketaan ero päivinä

    // Palautetaan DueStatus, label ja värit päivien eron perusteella
    if (diffDays < 0) {
        return {
        status: 'overdue' as DueStatus,
        label: `myöhässä ${Math.abs(diffDays)} pv`, // myöhässä olevien päivien määrä absoluuttisena (+) arvona
        topRowBackgroundColor: '#d14947', // punainen
        cardBackgroundColor: '#f5a8a3',
        borderColor: '#dc857b',
        textDark: '#881f15',
        textLight: '#f2ebeb',
        };
    } else if (diffDays === 0) {
        return {
        status: 'today' as DueStatus,
        label: 'tänään',
        topRowBackgroundColor: '#c46327', // oranssi
        cardBackgroundColor: '#f1b49a', 
        borderColor: '#d4876d',
        textDark: '#702203',
        textLight: '#f5f0ee',
        };
    } else if (diffDays === 1) {
        return {
        status: 'tomorrow' as DueStatus,
        label: 'huomenna',
        topRowBackgroundColor: '#c48827', // keltainen
        cardBackgroundColor: '#f1d19a', 
        borderColor: '#d4b06d',
        textDark: '#704503',
        textLight: '#f5f3ee',
        };
    } else {
        return {
        status: 'future' as DueStatus,
        label: `${diffDays} pv aikaa`, 
        topRowBackgroundColor: '#4d7a85', // sininen
        cardBackgroundColor: '#aac4d2', 
        borderColor: '#8ba9bf',
        textDark: '#274b5f',
        textLight: '#e7eef3',
        };
    }
};


///////// Tehtävien toistuvuuden määrittely /////////
export type TimeUnit = 'days' | 'weeks' | 'months' | 'years';

export const TimeUnits: { key: TimeUnit; label: string }[] = [
    { key: 'days', label: 'pv' },
    { key: 'weeks', label: 'vk' },
    { key: 'months', label: 'kk' },
    { key: 'years', label: 'v' },
];

// Aikayksikön muuttaminen päiviksi
export const toIntervalDays = (amount: number, timeUnit: TimeUnit): number => {
    if (timeUnit === 'days') return amount; 
    if (timeUnit === 'weeks') return amount * 7;
    if (timeUnit === 'months') return amount * 30;
    if (timeUnit === 'years') return amount * 365;
    return 0; // ei toistu
};


//////////// Tehtävän merkitseminen valmiiksi /////////////
// Tietojen päivittäminen/lisääminen
export const markTaskAsDone = (item: Task): Task => {
    const isRecurring = item.intervalDays > 0;

    return {
        ...item, // säilytetään kaikki alkuperäisen tehtävän tiedot
        lastDoneDate: new Date().toISOString().split('T')[0], // asetetaan nykyhetki 'YYYY-MM-DD' muotoisena merkkijonona
        nextDueDate: isRecurring ? calculateNextDueDate(item.intervalDays) : item.nextDueDate, // uusi eräpäivä vain toistuville
        isDone: !isRecurring, // merkitään valmiiksi vain jos ei toistu
    };
};

// Seuraavan eräpäivän laskeminen
export const calculateNextDueDate = (intervalDays: number): string => { 
    const nextDate = new Date(); // nykyinen päivämäärä
    nextDate.setDate(nextDate.getDate() + intervalDays); // haetaan kuluvan kuukauden päivänumero ja lisätään siihen toistoväli
    return nextDate.toISOString().split('T')[0]; // muuttaminen 'YYYY-MM-DD' - muotoon
};



