/**
 * Creates a spreadsheet containing daily view counts, watch-time metrics,
 * and new-subscriber counts for a channel's videos.
 */
const createReport = () => {
    if (!YouTube.Channels || !YouTubeAnalytics.Reports) {
        return;
    }
    // Retrieve info about the user's YouTube channel.
    const channels = YouTube.Channels.list("id,contentDetails", {
        mine: true,
    });

    if (!channels.items) {
        return;
    }

    const channelId = channels.items[0].id;

    // Retrieve analytics report for the channel.
    const today = new Date();
    const lastMonth = new Date(today.getTime() - ONE_MONTH_IN_MS);

    const metrics = [
        "views",
        "estimatedMinutesWatched",
        "averageViewDuration",
        "subscribersGained",
    ];
    const result = YouTubeAnalytics.Reports.query({
        ids: "channel==" + channelId,
        startDate: formatDateString(lastMonth),
        endDate: formatDateString(today),
        metrics: metrics.join(","),
        dimensions: "day",
        sort: "day",
    });

    if (!result.rows) {
        Logger.log("No rows returned.");
        return;
    }
    if (!result.columnHeaders) {
        Logger.log("No columnHeaders returned.");
        return;
    }
    const spreadsheet = SpreadsheetApp.create("YouTube Analytics Report");
    const sheet = spreadsheet.getActiveSheet();

    // Append the headers.
    const headers = result.columnHeaders.map((columnHeader) => {
        return formatColumnName(columnHeader.name || "");
    });
    sheet.appendRow(headers);

    // Append the results.
    sheet
        .getRange(2, 1, result.rows.length, headers.length)
        .setValues(result.rows);

    Logger.log("Report spreadsheet created: %s", spreadsheet.getUrl());
};

/**
 * Converts a Date object into a YYYY-MM-DD string.
 * @param {Date} date The date to convert to a string.
 * @return {string} The formatted date.
 */
function formatDateString(date: Date): string {
    return Utilities.formatDate(
        date,
        Session.getScriptTimeZone(),
        "yyyy-MM-dd"
    );
}

/**
 * Formats a column name into a more human-friendly name.
 * @param {string} columnName The unprocessed name of the column.
 * @return {string} The formatted column name.
 * @example "averageViewPercentage" becomes "Average View Percentage".
 */
function formatColumnName(columnName: string): string {
    let name = columnName.replace(/([a-z])([A-Z])/g, "$1 $2");
    name = name.slice(0, 1).toUpperCase() + name.slice(1);
    return name;
}
