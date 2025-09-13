// count totle number of hourse

function calculateOperationalHours(open_time, close_time) {
    // Parse hours and minutes
    const [openHour, openMinute] = open_time.split(':').map(Number);
    const [closeHour, closeMinute] = close_time.split(':').map(Number);

    // Convert times into minutes
    const openInMinutes = openHour * 60 + openMinute;
    const closeInMinutes = closeHour * 60 + closeMinute;

    let diffInMinutes = closeInMinutes - openInMinutes;

    // Handle case where closing time is past midnight
    if (diffInMinutes < 0) {
        diffInMinutes += 24 * 60;
    }

    const totalHours = diffInMinutes / 60;
    return totalHours;
}

module.exports ={
    calculateOperationalHours
}