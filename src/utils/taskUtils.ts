import { Task } from '../types/task';

//////// DueDaten vertailu nykyhetkeen DueStatus-tyypin palauttamiseksi //////////
export type DueStatus = 'overdue' | 'today' | 'future'; // Määritellään DueStatus tyyppi
// Funktio, joka ottaa vastaan 'YYYY-MM-DD' muotoisen merkkijonon ja palauttaa DueStatus-tyypin
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
        topRowBackgroundColor: '#c48827', // keltainen
        cardBackgroundColor: '#f1d19a', 
        borderColor: '#d4b06d',
        textDark: '#704503',
        textLight: '#f5f3ee',
        };
    } else {
        return {
        status: 'future' as DueStatus,
        label: diffDays === 1 ? 'huomenna' : `${diffDays} pv aikaa`, // tarkistetaan, onko ero 1 päivä vai useampi
        topRowBackgroundColor: '#4d8551', // vihreä
        cardBackgroundColor: '#aad2ad', 
        borderColor: '#8bbf8b',
        textDark: '#185a21',
        textLight: '#e7f3e8',
        };
    }
};


