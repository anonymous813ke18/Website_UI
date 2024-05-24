import pandas as pd

def approval_table_function(project):
    import pandas as pd
    
    # Load the data from the Excel file into a pandas DataFrame
    df = pd.read_excel('Excel/handover_data.xlsx')

    # Filter the DataFrame based on the parameters
    source_df = df[(df['Source'] == project) & (df["ApprovalToSend"] != "YES") & (df["Status"] == "Pending") & (df["ApprovalToReceive"] != "YES")]
    destination_df = df[(df['Destination'] == project) & (~pd.isnull(df["CompletionDate"])) & (df["Status"] == "Pending")]

    # Drop duplicates based on "FormID" in both dataframes
    source_df = source_df.drop_duplicates(subset="FormID")
    destination_df = destination_df.drop_duplicates(subset="FormID")

    # Update columns in the DataFrames
    destination_df["ApprovalType"] = "Receive"
    source_df["ApprovalType"] = "Send"

    # Append destination_df to source_df
    source_df = pd.concat([source_df, destination_df])

    # Sort the DataFrame based on "InitiationDate" in descending order
    source_df = source_df.sort_values("InitiationDate", ascending=False)


    # Convert the filtered data to JSON format
    json_data = source_df.to_json(orient='records')

    return json_data


