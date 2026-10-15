rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Рейтинг: одна запись на игрока, id записи равен id анонимного входа.
    match /scores/{uid} {
      allow read: if true;

      allow create, update: if request.auth != null
        && request.auth.uid == uid
        && request.resource.data.keys().hasOnly(['best', 'name', 't'])
        && request.resource.data.best is int
        && request.resource.data.best >= 1
        && request.resource.data.best <= 5000
        && request.resource.data.name is string
        && request.resource.data.name.size() <= 16
        && request.resource.data.t is int
        // Рекорд нельзя уменьшить.
        && (resource == null || request.resource.data.best >= resource.data.best);

      allow delete: if false;
    }
  }
}
