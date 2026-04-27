CREATE OR REPLACE VIEW vw_pupil_guardians AS
SELECT
  pg.id,
  pg.pupil_id AS pupilId,
  pg.guardian_id AS guardianId,
  pg.relationship,
  pg.is_primary AS isPrimary,
  pg.created_at AS createdAt,
  pg.updated_at AS updatedAt,
  pg.deleted_at AS deletedAt,
  g.firstname AS guardianFirstName,
  g.middlename AS guardianMiddleName,
  g.lastname AS guardianLastName,
  g.suffix AS guardianSuffix,
  g.contact_number AS guardianContactNumber,
  g.address AS guardianAddress,
  g.barangay AS guardianBarangay,
  g.municipality_city AS guardianMunicipalityCity,
  g.province AS guardianProvince,
  g.region AS guardianRegion,
  g.profile_picture AS guardianProfilePicture,
  g.created_at AS guardianCreatedAt,
  g.updated_at AS guardianUpdatedAt,
  g.deleted_at AS guardianDeletedAt,
  p.lrn AS pupilLrn,
  p.first_name AS pupilFirstName,
  p.middle_name AS pupilMiddleName,
  p.last_name AS pupilLastName,
  p.suffix AS pupilSuffix
FROM pupil_guardians pg
INNER JOIN guardians g ON g.id = pg.guardian_id
INNER JOIN pupils p ON p.id = pg.pupil_id
WHERE pg.deleted_at IS NULL
  AND g.deleted_at IS NULL
  AND p.deleted_at IS NULL;
