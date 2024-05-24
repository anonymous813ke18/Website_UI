import pandas as pd
from flask import jsonify

def transaction_history_table_function(name, project):
    try:
        # Load the data from the Excel file into a pandas DataFrame
        df = pd.read_excel('Excel/handover_data.xlsx')
    except Exception as e:
        print("Error loading data from Excel file:", e)
        return jsonify({"error": "Error loading data from Excel file"})

    Send_df = df[((df['Source'] == project) | (df['Sender'] == name)) & (df["Status"] != "Pending")]
    Receive_df = df[((df['Destination'] == project) | (df['Receiver'] == name)) & (df["Status"] != "Pending")]


    # Update columns in the DataFrames
    Send_df["TransactionType"] = "Send"
    Receive_df["TransactionType"] = "Receive"

    try:
        # Iterate over unique FormID present in both Send and Receive DataFrames
        common_form_ids = set(Send_df['FormID']).intersection(Receive_df['FormID'])
        for form_id in common_form_ids:
            # Update TransactionType in Send_df
            Send_df.loc[Send_df['FormID'] == form_id, 'TransactionType'] = 'Send/Receive'
            # Remove corresponding rows from Receive_df
            Receive_df = Receive_df[Receive_df['FormID'] != form_id]
    except Exception as e:
        print("Error processing data:", e)
        return jsonify({"error": "Error processing data"})

    # Append Receive_df to Send_df
    combined_df = pd.concat([Send_df, Receive_df])

    try:
        # Remove duplicate entries based on FormID
        combined_df = combined_df.drop_duplicates(subset=['FormID'])

        # Sort the DataFrame based on "InitiationDate"
        combined_df = combined_df.sort_values(by="InitiationDate", ascending=False)
        print('this is the table data being sent', combined_df)
        # Convert the filtered data to JSON format
        json_data = combined_df.to_json(orient='records')
        return json_data
    except Exception as e:
        print("Error converting data to JSON:", e)
        return jsonify({"error": "Error converting data to JSON"})
