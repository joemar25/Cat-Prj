# **Summary of API Routes**

| Route                          | Method | Description                                      |
|--------------------------------|--------|--------------------------------------------------|
| `/api/upload`                  | POST   | Uploads a file to the server.                    |
| `/api/attachments`             | POST   | Creates an `Attachment` record.                  |
| `/api/forms/[id]`              | PATCH  | Updates the `documentUrl` in `BaseRegistryForm`. |
| `/api/forms/[id]`              | GET    | Retrieves details of a `BaseRegistryForm`.       |
| `/api/attachments/[documentId]`| GET    | Retrieves all attachments for a form.            |
| `/api/attachments/[id]`        | DELETE | Deletes a specific attachment.                   |
| `/api/attachments/[id]`        | PATCH  | Updates the status of an attachment.             |

---

## **Usage Example**

1. **Upload a File**:
   - Call `/api/upload` to upload the file and get the `fileUrl`.

2. **Create an Attachment**:
   - Call `/api/attachments` with the `fileUrl` and other details to create an `Attachment` record.

3. **Update BaseRegistryForm**:
   - Call `/api/forms/[id]` to update the `documentUrl` in the `BaseRegistryForm`.

4. **Fetch Attachments**:
   - Call `/api/attachments/[documentId]` to retrieve all attachments for a form.

5. **Delete or Update Attachment**:
   - Use `/api/attachments/[id]` to delete or update the status of an attachment.
