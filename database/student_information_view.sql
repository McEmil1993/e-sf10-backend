CREATE OR REPLACE VIEW vw_student_information AS
SELECT
  p.id AS studentId,
  p.lrn AS studentLrn,
  mt.id AS motherTongueId,
  mt.name AS motherTongueName,
  mt.sort_order AS motherTongueSortOrder,
  mt.is_active AS motherTongueIsActive,
  ig.id AS indigenousGroupId,
  ig.name AS indigenousGroupName,
  ig.sort_order AS indigenousGroupSortOrder,
  ig.is_active AS indigenousGroupIsActive,
  r.id AS religionId,
  r.name AS religionName,
  r.sort_order AS religionSortOrder,
  r.is_active AS religionIsActive
FROM students p
LEFT JOIN student_mother_tongues pmt
  ON pmt.student_id = p.id
  AND pmt.deleted_at IS NULL
LEFT JOIN mother_tongues mt
  ON mt.id = pmt.mother_tongue_id
  AND mt.deleted_at IS NULL
LEFT JOIN student_indigenous_groups pig
  ON pig.student_id = p.id
  AND pig.deleted_at IS NULL
LEFT JOIN indigenous_groups ig
  ON ig.id = pig.indigenous_group_id
  AND ig.deleted_at IS NULL
LEFT JOIN student_religions pr
  ON pr.student_id = p.id
  AND pr.deleted_at IS NULL
LEFT JOIN religions r
  ON r.id = pr.religion_id
  AND r.deleted_at IS NULL
WHERE p.deleted_at IS NULL;
