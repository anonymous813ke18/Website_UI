import pandas as pd


def approve_receive_request_function(data):

    print('this is the approve_receive_request_function dataaaaaaaaaaaa',data)
    # Extract FormNo from the first dictionary
    form_id = data[0]['FormNo']

    # Load the handover_data Excel file into a pandas DataFrame
    df_handover = pd.read_excel("Excel/handover_data.xlsx")

    # Update DataFrame
    for index, row in df_handover.iterrows():
        if row['FormID'] == form_id:
            df_handover.at[index, 'ApprovalToReceive'] = 'YES'
            df_handover.at[index, 'Status'] = 'Approved'

    # Save the updated DataFrame back to Excel
    df_handover.to_excel("Excel/handover_data.xlsx", index=False)

    # Load the inventory Excel file into a pandas DataFrame
    df_inventory = pd.read_excel("Excel/inventory.xlsx")

    # Update inventory DataFrame based on SerialNo
    for item in data[1:]:
        serial_no = item.get('SerialNo')
        condition = item.get('Condition')
        owner = data[0].get('Owner')
        project = data[0].get('Project')

        # Find the row with matching SerialNo and update values
        df_inventory.loc[df_inventory['SerialNo'] == serial_no, ['Condition', 'Owner', 'Project']] = [condition, owner, project]

    # Save the updated inventory DataFrame back to Excel
    df_inventory.to_excel("Excel/inventory.xlsx", index=False)



