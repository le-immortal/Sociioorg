# Sociioorg

## Database structure

- users
    - document id will be uid
        - collections
            - certificates
                - document id will be certificate id (randomly generated by Firestore)
                    - data
                        - certificateId
                        - organisationId
                        - eventId
                        - time
                        - duration (number of hours worked)
                        - url
            - events
                - document id will be event id
                    - data
                        - eventId
                        - hasRegistered (bool)
                            - true => person is registered for the event
                            - false => person has just enabled notifications for the event
                        - time
            - organisations
                - document id will be organisation id
                    - data
                        - organisationId
        - data
            - uid
            - name
            - email
            - phoneNumber
            - location
            - occupation
            - photoUrl

- organisations
    - document id will be uid
        - collections
            - organisers
                - document id will be uid of the person
                    - data
                        - uid
            - events
                - document id will be event id
                    - data
                        - eventId
        - data
            - organisationId
            - email
            - contactNumber
            - organisationName
            - registrationDocumentUrl
            - websiteUrl
            - isVerified (bool)
                - false (default)
                - true (after manual verification)

- events
    - document id will be event id (randomly generated by Firestore)
        - collections
            - messages
                - documentId will be messageId (randomly generated by Firestore)
                    - data
                        - messageId
                        - text
                        - senderName
                        - senderUid
                        - dateTime
            - users
                - document id will be uid
                    - hasAttended
                    - hasRegistered (bool)
                        - true => person is registered for the event
                        - false => person has just enabled notifications for the event
                    - name
                    - time
                    - uid
            - images
                - document id will be the imageId (randomly generated by Firestore)
                    - data
                        - imageId
                        - imageUrl
                        - uploaderUid
        - data
            - eventId
            - organisationId
            - dateTime
            - description
            - duration
            - isFinished
            - eventName
            - location (String)
            - latitude (doube)
            - longitude (double)
